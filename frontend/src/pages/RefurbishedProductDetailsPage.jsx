import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { server } from "../server";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const RefurbishedProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${server}/refurbished/product/${id}`);
        if (res.data.success) setProduct(res.data.product);
      } catch (err) {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) { toast.error("Please login"); return; }
    const cartData = {
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      originalPrice: product.originalPrice,
      discountPrice: product.refurbPrice,
      stock: 1,
      images: product.images,
      qty: 1,
      shopId: product.sellerId || "refurbished_store",
      shop: { name: "Amazon Refurbished", avatar: "default-avatar.png" },
      isRefurbished: true,
      greenCreditsReward: product.greenCreditsReward,
    };
    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (existingCart.find((i) => i._id === product._id)) {
      toast.error("Already in cart!");
      return;
    }
    existingCart.push(cartData);
    localStorage.setItem("cartItems", JSON.stringify(existingCart));
    toast.success(`Added to cart! +${product.greenCreditsReward} Green Credits at checkout 🌱`);
    window.location.reload();
  };

  if (loading) return <div><Header /><div className="text-center py-20">Loading...</div><Footer /></div>;
  if (!product) return <div><Header /><div className="text-center py-20">Product not found</div><Footer /></div>;

  const discount = Math.round((1 - product.refurbPrice / product.originalPrice) * 100);

  return (
    <div>
      <Header activeHeading={3} />
      <div className={`${styles.section} py-8`}>
        <div className="bg-white border border-[#e7e7e7] rounded-lg p-6">
          <div className="block 800px:flex gap-8">
            {/* Left: Image */}
            <div className="w-full 800px:w-[40%] mb-6 800px:mb-0">
              <div className="border border-[#e7e7e7] rounded-lg p-6 flex items-center justify-center bg-[#fafafa] relative">
                <span className="absolute top-3 left-3 bg-[#00a86b] text-white text-[10px] font-bold px-2 py-1 rounded">CERTIFIED ♻️</span>
                <span className="absolute top-3 right-3 bg-[#1976d2] text-white text-[10px] font-bold px-2 py-1 rounded">{product.conditionScore}/10</span>
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/400"}
                  alt={product.name}
                  className="max-h-[350px] object-contain"
                />
              </div>
            </div>

            {/* Right: Details */}
            <div className="w-full 800px:w-[60%]">
              <h1 className="text-[22px] font-[500] text-[#0f1111] leading-tight mb-2">{product.name}</h1>

              {/* Trust Badges */}
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#e8f5e9] text-[#00a86b] text-[11px] font-semibold px-2 py-0.5 rounded">Trust: {product.trustScore}%</span>
                <span className="bg-[#e3f2fd] text-[#1976d2] text-[11px] font-semibold px-2 py-0.5 rounded">AI Verified</span>
                <span className="bg-[#fff3e0] text-[#ff9900] text-[11px] font-semibold px-2 py-0.5 rounded">Certified Refurbished</span>
              </div>

              {/* Price */}
              <div className="border-b border-[#e7e7e7] pb-4 mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] text-[#cc0c39]">-{discount}%</span>
                  <span className="text-[11px]">₹</span>
                  <span className="text-[28px] font-[500] text-[#0f1111]">{product.refurbPrice?.toLocaleString()}</span>
                </div>
                <p className="text-[13px] text-[#565959]">
                  M.R.P: <span className="line-through">₹{product.originalPrice?.toLocaleString()}</span>
                  <span className="ml-2 text-[#cc0c39]">Save ₹{(product.originalPrice - product.refurbPrice)?.toLocaleString()} ({discount}%)</span>
                </p>
                <p className="text-[12px] text-[#555] mt-1">Inclusive of all taxes</p>
              </div>

              {/* AI Health Card */}
              <div className="bg-[#f0faf0] border border-[#c8e6c9] rounded-lg p-4 mb-4">
                <h3 className="text-[14px] font-[600] text-[#131921] mb-2">🤖 AI Health Card</h3>
                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  <div className="flex justify-between"><span className="text-[#555]">Condition Score</span><span className="font-[600] text-[#00a86b]">{product.conditionScore}/10</span></div>
                  <div className="flex justify-between"><span className="text-[#555]">Trust Score</span><span className="font-[600] text-[#1976d2]">{product.trustScore}%</span></div>
                </div>
                {product.defects && product.defects.length > 0 && product.defects[0]?.type !== "None" && (
                  <div className="mt-2 pt-2 border-t border-[#c8e6c9]">
                    <p className="text-[11px] text-[#555] font-[500] mb-1">Detected Defects:</p>
                    {product.defects.map((d, i) => (
                      <p key={i} className="text-[11px] text-[#555]">• {d.type} — {d.severity} ({d.location})</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Green Credits */}
              <div className="flex items-center gap-2 mb-4 bg-[#fff3e0] rounded-lg px-4 py-2">
                <span className="text-[16px]">🌱</span>
                <span className="text-[13px] text-[#131921]">
                  Earn <strong className="text-[#ff9900]">{product.greenCreditsReward} Green Credits</strong> on this purchase
                </span>
                <span className="text-[11px] text-[#555] ml-auto">Saves {product.co2Saved} CO₂</span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-4">
                  <h3 className="text-[14px] font-[600] text-[#131921] mb-1">About this item</h3>
                  <p className="text-[13px] text-[#555] leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Delivery */}
              <p className="text-[13px] text-[#007600] mb-4">✓ FREE delivery. Usually ships within 1-2 days.</p>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full 800px:w-auto h-[40px] px-10 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-[20px] text-[14px] font-[500] text-[#131921] hover:from-[#f5d78e] hover:to-[#eeb933] transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefurbishedProductDetailsPage;
