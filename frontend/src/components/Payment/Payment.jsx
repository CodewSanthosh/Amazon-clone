import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [select, setSelect] = useState(3); // Default COD

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(data);
  }, []);

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ description: "Amazon Second Life", amount: { currency_code: "USD", value: orderData?.totalPrice } }],
      application_context: { shipping_preference: "NO_SHIPPING" },
    }).then((orderID) => orderID);
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;
      if (payer) paypalPaymentHandler(payer);
    });
  };

  const paypalPaymentHandler = async (paymentInfo) => {
    order.paymentInfo = { id: paymentInfo.payer_id, status: "succeeded", type: "Paypal" };
    await axios.post(`${server}/order/create-order`, order, { headers: { "Content-Type": "application/json" } }).then(() => {
      setOpen(false); navigate("/order/success"); toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([])); localStorage.setItem("latestOrder", JSON.stringify([])); window.location.reload();
    });
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();
    order.paymentInfo = { type: "Cash On Delivery" };
    await axios.post(`${server}/order/create-order`, order, { headers: { "Content-Type": "application/json" } }).then(() => {
      navigate("/order/success"); toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([])); localStorage.setItem("latestOrder", JSON.stringify([])); window.location.reload();
    });
  };

  const shipping = orderData?.shipping?.toFixed(2);

  return (
    <div className={`${styles.section} py-8`}>
      <div className="block 800px:flex gap-6">
        {/* Left: Payment Methods */}
        <div className="w-full 800px:w-[65%]">
          <div className="bg-white border border-[#e7e7e7] rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e7e7e7] bg-[#f7f7f7]">
              <h2 className="text-[18px] font-[600] text-[#131921]">2. Payment Method</h2>
            </div>
            <div className="p-5">

              {/* Option 1: Card (disabled without Stripe) */}
              <div className="border border-[#e7e7e7] rounded-lg mb-3 overflow-hidden opacity-50">
                <div className="flex items-center gap-3 px-4 py-3 bg-[#fafafa]">
                  <input type="radio" disabled className="w-[16px] h-[16px]" />
                  <span className="text-[14px] font-[500] text-[#131921]">Credit or Debit Card</span>
                  <span className="text-[11px] text-[#999] ml-auto">Configure Stripe keys to enable</span>
                </div>
              </div>

              {/* Option 2: PayPal */}
              <div className={`border rounded-lg mb-3 overflow-hidden ${select === 2 ? "border-[#ff9900]" : "border-[#e7e7e7]"}`}>
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-[#fafafa]" onClick={() => setSelect(2)}>
                  <input type="radio" checked={select === 2} readOnly className="accent-[#ff9900] w-[16px] h-[16px]" />
                  <span className="text-[14px] font-[500] text-[#131921]">PayPal</span>
                </div>
                {select === 2 && (
                  <div className="p-4 border-t border-[#e7e7e7]">
                    <button onClick={() => setOpen(true)} className="w-full h-[38px] bg-[#0070ba] text-white rounded-[4px] text-[13px] font-[500] hover:bg-[#003087] transition">
                      Pay with PayPal
                    </button>
                    {open && (
                      <div className="fixed inset-0 bg-[#00000066] flex items-center justify-center z-[100]">
                        <div className="bg-white rounded-lg w-[90%] max-w-[500px] p-6 relative max-h-[80vh] overflow-y-auto">
                          <RxCross1 size={20} className="absolute top-4 right-4 cursor-pointer text-[#555]" onClick={() => setOpen(false)} />
                          <h3 className="text-[16px] font-[600] mb-4">Complete PayPal Payment</h3>
                          <PayPalScriptProvider options={{ "client-id": "AXRhO4eNGo3L8MUFazEFnW9hNwBP2rTwUWNqMMRcFtjpbCrDVt6vS8HoWa7hyLlfO0fxG3OU_9zit7KN" }}>
                            <PayPalButtons style={{ layout: "vertical" }} onApprove={onApprove} createOrder={createOrder} />
                          </PayPalScriptProvider>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Option 3: COD */}
              <div className={`border rounded-lg overflow-hidden ${select === 3 ? "border-[#ff9900]" : "border-[#e7e7e7]"}`}>
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-[#fafafa]" onClick={() => setSelect(3)}>
                  <input type="radio" checked={select === 3} readOnly className="accent-[#ff9900] w-[16px] h-[16px]" />
                  <span className="text-[14px] font-[500] text-[#131921]">Cash on Delivery</span>
                  <span className="text-[11px] text-[#555] ml-auto">Pay when delivered</span>
                </div>
                {select === 3 && (
                  <div className="p-4 border-t border-[#e7e7e7]">
                    <p className="text-[12px] text-[#555] mb-3">Pay in cash when your order is delivered to your doorstep.</p>
                    <button onClick={cashOnDeliveryHandler} className="w-full h-[38px] bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-[4px] text-[13px] font-[500] text-[#131921] hover:from-[#f5d78e] hover:to-[#eeb933]">
                      Place Order — Cash on Delivery
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="w-full 800px:w-[35%] mt-6 800px:mt-0">
          <div className="bg-white border border-[#e7e7e7] rounded-lg overflow-hidden sticky top-[70px]">
            <div className="px-5 py-4 border-b border-[#e7e7e7] bg-[#f7f7f7]">
              <h2 className="text-[16px] font-[600] text-[#131921]">Order Summary</h2>
            </div>
            <div className="p-5 space-y-2 text-[13px]">
              <div className="flex justify-between"><span className="text-[#555]">Items:</span><span>₹{orderData?.subTotalPrice?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[#555]">Delivery:</span><span>₹{shipping}</span></div>
              {orderData?.discountPrice && <div className="flex justify-between"><span className="text-[#555]">Discount:</span><span className="text-[#cc0c39]">-₹{orderData.discountPrice}</span></div>}
              <div className="flex justify-between border-t pt-3 text-[18px] font-[700] text-[#cc0c39]">
                <span className="text-[#131921]">Total:</span>
                <span>₹{orderData?.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
            <div className="px-5 pb-4">
              <p className="text-[11px] text-[#555] text-center">🔒 Secure payment</p>
            </div>
          </div>

          <div className="mt-4 bg-[#e8f5e9] border border-[#c8e6c9] rounded-lg p-4">
            <p className="text-[12px] text-[#2e7d32]">
              🌱 Earn <strong>Green Credits</strong> on this purchase if you buy refurbished or choose sustainable options!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
