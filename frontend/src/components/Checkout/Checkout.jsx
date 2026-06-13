import React, { useState, useEffect } from "react";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageUrl";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const paymentSubmit = () => {
    if (address1 === "" || address2 === "" || zipCode === null || country === "" || city === "") {
      toast.error("Please choose your delivery address!");
    } else {
      const shippingAddress = { address1, address2, zipCode, country, city };
      const orderData = { cart, totalPrice, subTotalPrice, shipping, discountPrice, shippingAddress, user };
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);
  const shipping = subTotalPrice * 0.1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.get(`${server}/coupon/get-coupon-value/${couponCode}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;
      if (res.data.couponCode !== null) {
        const isCouponValid = cart && cart.filter((item) => item.shopId === shopId);
        if (isCouponValid.length === 0) { toast.error("Coupon code is not valid for this shop"); setCouponCode(""); }
        else {
          const eligiblePrice = isCouponValid.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);
          setDiscountPrice((eligiblePrice * couponCodeValue) / 100);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      } else { toast.error("Coupon code doesn't exist!"); setCouponCode(""); }
    });
  };

  const discountPercentenge = couponCodeData ? discountPrice : "";
  const totalPrice = couponCodeData ? (subTotalPrice + shipping - discountPercentenge).toFixed(2) : (subTotalPrice + shipping).toFixed(2);

  const inputClass = "w-full h-[38px] px-3 border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]";

  return (
    <div className={`${styles.section} py-8`}>
      <div className="block 800px:flex gap-6">
        {/* Left: Shipping */}
        <div className="w-full 800px:w-[65%]">
          <div className="bg-white border border-[#e7e7e7] rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e7e7e7] bg-[#f7f7f7]">
              <h2 className="text-[18px] font-[600] text-[#131921]">1. Delivery Address</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 800px:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[12px] font-[600] text-[#111] block mb-1">Full Name</label>
                  <input type="text" value={user && user.name} readOnly className={inputClass} />
                </div>
                <div>
                  <label className="text-[12px] font-[600] text-[#111] block mb-1">Email</label>
                  <input type="email" value={user && user.email} readOnly className={inputClass} />
                </div>
                <div>
                  <label className="text-[12px] font-[600] text-[#111] block mb-1">Phone Number</label>
                  <input type="number" value={user && user.phoneNumber} readOnly className={inputClass} />
                </div>
                <div>
                  <label className="text-[12px] font-[600] text-[#111] block mb-1">Zip Code *</label>
                  <input type="number" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className={inputClass} placeholder="600001" />
                </div>
                <div>
                  <label className="text-[12px] font-[600] text-[#111] block mb-1">Country *</label>
                  <select className={inputClass} value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="">Select country</option>
                    {Country.getAllCountries().map((item) => (<option key={item.isoCode} value={item.isoCode}>{item.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-[600] text-[#111] block mb-1">State/City *</label>
                  <select className={inputClass} value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="">Select state</option>
                    {State.getStatesOfCountry(country).map((item) => (<option key={item.isoCode} value={item.isoCode}>{item.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-[600] text-[#111] block mb-1">Address Line 1 *</label>
                  <input type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} className={inputClass} placeholder="House no, Street" />
                </div>
                <div>
                  <label className="text-[12px] font-[600] text-[#111] block mb-1">Address Line 2 *</label>
                  <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} className={inputClass} placeholder="Landmark, Area" />
                </div>
              </div>

              {/* Saved addresses */}
              <button className="text-[13px] text-[#0066c0] hover:text-[#c45500] hover:underline font-[500]" onClick={() => setUserInfo(!userInfo)}>
                {userInfo ? "Hide saved addresses" : "Choose from saved addresses ▾"}
              </button>
              {userInfo && user?.addresses?.length > 0 && (
                <div className="mt-3 space-y-2">
                  {user.addresses.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border border-[#e7e7e7] rounded hover:border-[#ff9900] cursor-pointer"
                      onClick={() => { setAddress1(item.address1); setAddress2(item.address2); setZipCode(item.zipCode); setCountry(item.country); setCity(item.city); }}>
                      <input type="radio" name="savedAddr" className="accent-[#ff9900]" />
                      <span className="text-[12px] text-[#111]"><strong>{item.addressType}</strong> — {item.address1}, {item.address2}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="w-full 800px:w-[35%] mt-6 800px:mt-0">
          <div className="bg-white border border-[#e7e7e7] rounded-lg overflow-hidden sticky top-[70px]">
            <div className="px-5 py-4 border-b border-[#e7e7e7] bg-[#f7f7f7]">
              <h2 className="text-[16px] font-[600] text-[#131921]">Order Summary</h2>
            </div>
            <div className="p-5">
              {/* Items preview */}
              <div className="mb-4 max-h-[150px] overflow-y-auto">
                {cart.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <img src={getImageUrl(item.images?.[0])} alt="" className="w-[40px] h-[40px] object-contain rounded border p-0.5" />
                    <span className="text-[11px] text-[#555] flex-1 line-clamp-1">{item.name}</span>
                    <span className="text-[11px] font-[500]">x{item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-[13px] border-t pt-3">
                <div className="flex justify-between"><span className="text-[#555]">Items:</span><span>₹{subTotalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-[#555]">Delivery:</span><span>₹{shipping.toFixed(0)}</span></div>
                {discountPercentenge && <div className="flex justify-between"><span className="text-[#555]">Coupon Discount:</span><span className="text-[#cc0c39]">-₹{discountPercentenge}</span></div>}
                <div className="flex justify-between border-t pt-2 text-[16px] font-[700] text-[#131921]">
                  <span>Order Total:</span><span className="text-[#cc0c39]">₹{Number(totalPrice).toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon */}
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="flex gap-2">
                  <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter coupon code" className="flex-1 h-[32px] px-2 border border-[#a6a6a6] rounded text-[12px] outline-none focus:border-[#e77600]" />
                  <button type="submit" className="h-[32px] px-3 bg-gradient-to-b from-[#f7f8fa] to-[#e7e9ec] border border-[#adb1b8] rounded text-[11px] font-[500] hover:from-[#e7eaf0] hover:to-[#d9dce1]">Apply</button>
                </div>
              </form>

              {/* Proceed button */}
              <button type="button" onClick={paymentSubmit}
                className="w-full mt-4 h-[40px] bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-[4px] text-[14px] font-[500] text-[#131921] hover:from-[#f5d78e] hover:to-[#eeb933] transition">
                Proceed to Payment
              </button>

              <p className="text-[11px] text-[#555] mt-3 text-center">
                🔒 Your transaction is secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
