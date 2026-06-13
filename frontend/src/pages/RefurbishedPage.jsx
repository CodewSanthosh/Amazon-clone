import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { server } from "../server";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const RefurbishedPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    fetchProducts();
  }, [sortBy]);

  const fetchProducts = async () => {
    try {
      let url = `${server}/refurbished/products`;
      if (sortBy) url += `?sort=${sortBy}`;
      const res = await axios.get(url);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.log("Error fetching refurbished products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase");
      return;
    }
    // Add to cart like a normal product and go through checkout
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

    // Check if already in cart
    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const exists = existingCart.find((i) => i._id === product._id);
    if (exists) {
      toast.error("Already in cart!");
      return;
    }

    existingCart.push(cartData);
    localStorage.setItem("cartItems", JSON.stringify(existingCart));
    toast.success(`Added to cart! +${product.greenCreditsReward} Green Credits at checkout 🌱`);
    window.location.reload();
  };

  const seedProducts = async () => {
    try {
      const res = await axios.post(`${server}/refurbished/seed`);
      if (res.data.success) {
        toast.success(`Loaded ${res.data.count} demo products`);
        fetchProducts();
      }
    } catch (err) {
      toast.error("Failed to load demo products");
    }
  };

  return (
    <div>
      <Header activeHeading={3} />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#e8f5e9] to-[#e3f2fd] py-8">
        <div className={`${styles.section}`}>
          <h1 className="text-[28px] 800px:text-[36px] font-[700] text-[#131921] font-Poppins">
            Certified Refurbished ♻️
          </h1>
          <p className="text-gray-600 text-[15px] mt-2">
            AI-verified, quality-graded products with Health Cards. Save money & the planet.
          </p>
          <div className="flex gap-4 mt-4 flex-wrap">
            <span className="bg-white px-3 py-1.5 rounded-full text-[12px] font-medium text-[#00a86b] shadow-sm">
              ✅ AI Verified Quality
            </span>
            <span className="bg-white px-3 py-1.5 rounded-full text-[12px] font-medium text-[#1976d2] shadow-sm">
              📋 Health Card Included
            </span>
            <span className="bg-white px-3 py-1.5 rounded-full text-[12px] font-medium text-[#ff9900] shadow-sm">
              🌱 Earn Green Credits
            </span>
          </div>
        </div>
      </div>

      {/* Sort & Filter Bar */}
      <div className={`${styles.section} py-4`}>
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-gray-500">
            {products.length} product{products.length !== 1 ? "s" : ""} available
          </p>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-[12px] outline-none focus:border-[#ff9900]"
            >
              <option value="">Sort: Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="score">Condition: Best First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={`${styles.section} pb-8`}>
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Loading refurbished products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-[50px]">♻️</span>
            <h3 className="text-[20px] font-[600] text-[#131921] mt-4">
              No refurbished products yet
            </h3>
            <p className="text-gray-500 text-[14px] mt-2 mb-4">
              Products will appear here once returns are AI-graded and approved for resale.
            </p>
            <button
              onClick={seedProducts}
              className="bg-[#ff9900] hover:bg-[#e68a00] text-[#131921] font-semibold px-6 py-2.5 rounded-md text-[13px] transition"
            >
              Load Demo Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 800px:grid-cols-2 1000px:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
              >
                {/* Badge */}
                <Link to={`/refurbished/${product._id}`}>
                <div className="relative cursor-pointer">
                  <img
                    src={product.images?.[0] || "https://via.placeholder.com/300x200"}
                    alt={product.name}
                    className="w-full h-[200px] object-contain p-4 bg-gray-50"
                  />
                  <span className="absolute top-3 left-3 bg-[#00a86b] text-white text-[10px] font-bold px-2 py-1 rounded">
                    CERTIFIED ♻️
                  </span>
                  <span className="absolute top-3 right-3 bg-[#1976d2] text-white text-[10px] font-bold px-2 py-1 rounded">
                    {product.conditionScore}/10
                  </span>
                </div>
                </Link>

                <div className="p-4">
                  <Link to={`/refurbished/${product._id}`}>
                  <h3 className="font-[600] text-[14px] text-[#131921] mb-2 line-clamp-2 hover:text-[#c45500] cursor-pointer">
                    {product.name}
                  </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[18px] font-bold text-[#131921]">
                      ₹{product.refurbPrice?.toLocaleString()}
                    </span>
                    <span className="text-[13px] text-gray-400 line-through">
                      ₹{product.originalPrice?.toLocaleString()}
                    </span>
                    <span className="text-[12px] font-bold text-[#00a86b]">
                      {Math.round((1 - product.refurbPrice / product.originalPrice) * 100)}% off
                    </span>
                  </div>

                  {/* Trust indicators */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#e8f5e9] text-[#00a86b] text-[10px] font-semibold px-2 py-0.5 rounded">
                      Trust: {product.trustScore}%
                    </span>
                    <span className="bg-[#e3f2fd] text-[#1976d2] text-[10px] font-semibold px-2 py-0.5 rounded">
                      AI Verified
                    </span>
                  </div>

                  {/* Defects */}
                  <p className="text-[11px] text-gray-500 mb-3">
                    📋{" "}
                    {product.defects && product.defects.length > 0 && product.defects[0].type !== "None"
                      ? product.defects.map((d) => `${d.type} (${d.severity})`).join(", ")
                      : "No visible defects"}
                  </p>

                  {/* Green credits */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-[11px] text-[#4caf50] font-medium">
                      🌱 Earn {product.greenCreditsReward} credits
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Saves {product.co2Saved} CO₂
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handlePurchase(product)}
                    className="w-full mt-3 bg-[#ff9900] hover:bg-[#e68a00] text-[#131921] font-semibold py-2 rounded-md text-[13px] transition"
                  >
                    Add to Cart — Earn {product.greenCreditsReward} 🌱
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RefurbishedPage;
