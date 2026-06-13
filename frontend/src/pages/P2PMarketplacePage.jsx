import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { server, backend_url } from "../server";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";

const P2PMarketplacePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Create form state
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [conditionScore, setConditionScore] = useState("");
  const [conditionDescription, setConditionDescription] = useState("");
  const [images, setImages] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [sortBy]);

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${server}/p2p/listings?sort=${sortBy}`);
      if (res.data.success) setListings(res.data.listings);
    } catch (err) {
      console.log("Error fetching P2P listings");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error("Please login first"); return; }
    setCreating(true);

    try {
      const formData = new FormData();
      formData.append("sellerId", user._id);
      formData.append("sellerName", user.name);
      formData.append("sellerEmail", user.email);
      formData.append("productName", productName);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("askingPrice", askingPrice);
      if (originalPrice) formData.append("originalPrice", originalPrice);
      if (conditionScore) formData.append("conditionScore", conditionScore);
      if (conditionDescription) formData.append("conditionDescription", conditionDescription);
      images.forEach((img) => formData.append("images", img));

      const res = await axios.post(`${server}/p2p/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Product listed! +60 Green Credits when it sells 🌱");
        setShowCreateForm(false);
        setProductName(""); setDescription(""); setCategory("");
        setAskingPrice(""); setOriginalPrice(""); setConditionScore("");
        setConditionDescription(""); setImages([]);
        fetchListings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create listing");
    } finally {
      setCreating(false);
    }
  };

  const handleInterest = async (listingId) => {
    if (!isAuthenticated) { toast.error("Please login"); return; }
    try {
      const res = await axios.post(`${server}/p2p/express-interest`, {
        listingId, userId: user._id, userName: user.name,
      });
      if (res.data.success) toast.success(res.data.message);
    } catch (err) {
      toast.error("Failed to express interest");
    }
  };

  const handlePurchase = async (listingId) => {
    if (!isAuthenticated) { toast.error("Please login"); return; }
    try {
      const res = await axios.post(`${server}/p2p/purchase`, {
        listingId, buyerId: user._id,
      });
      if (res.data.success) {
        toast.success(`🎉 Purchased! +${res.data.buyerCredits} Green Credits`);
        fetchListings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Purchase failed");
    }
  };

  return (
    <div>
      <Header activeHeading={5} />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#232f3e] to-[#131921] py-8">
        <div className={`${styles.section}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[28px] 800px:text-[32px] font-[700] text-white font-Poppins">
                Peer-to-Peer Marketplace 🤝
              </h1>
              <p className="text-gray-300 text-[14px] mt-2">
                Buy & sell directly with other users. Both parties earn Green Credits.
              </p>
            </div>
            <button
              onClick={() => { if (!isAuthenticated) { toast.error("Please login"); return; } setShowCreateForm(!showCreateForm); }}
              className="h-[38px] px-5 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-[4px] text-[13px] font-[600] text-[#131921] hover:from-[#f5d78e] hover:to-[#eeb933] transition"
            >
              + Sell My Product
            </button>
          </div>
        </div>
      </div>

      <div className={`${styles.section} py-6`}>
        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white border border-[#e7e7e7] rounded-lg p-6 mb-6">
            <h3 className="text-[18px] font-[600] text-[#131921] mb-4">List Your Product</h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 800px:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-[600] text-[#111] block mb-1">Product Name *</label>
                <input type="text" required value={productName} onChange={(e) => setProductName(e.target.value)}
                  className="w-full h-[35px] px-3 border border-[#a6a6a6] rounded text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]" placeholder="e.g. iPhone 13 Pro 128GB" />
              </div>
              <div>
                <label className="text-[12px] font-[600] text-[#111] block mb-1">Category *</label>
                <select required value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-[35px] px-3 border border-[#a6a6a6] rounded text-[13px] outline-none bg-white focus:border-[#e77600]">
                  <option value="">Select</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mobile and Tablets">Mobile & Tablets</option>
                  <option value="Computers and Laptops">Computers</option>
                  <option value="Cloths">Clothing</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accesories">Accessories</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-[600] text-[#111] block mb-1">Asking Price (₹) *</label>
                <input type="number" required value={askingPrice} onChange={(e) => setAskingPrice(e.target.value)}
                  className="w-full h-[35px] px-3 border border-[#a6a6a6] rounded text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]" placeholder="Your price" />
              </div>
              <div>
                <label className="text-[12px] font-[600] text-[#111] block mb-1">Original Price (₹)</label>
                <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full h-[35px] px-3 border border-[#a6a6a6] rounded text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]" placeholder="MRP when new" />
              </div>
              <div>
                <label className="text-[12px] font-[600] text-[#111] block mb-1">Condition (1-10)</label>
                <input type="number" min="1" max="10" value={conditionScore} onChange={(e) => setConditionScore(e.target.value)}
                  className="w-full h-[35px] px-3 border border-[#a6a6a6] rounded text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]" placeholder="Rate 1-10" />
              </div>
              <div>
                <label className="text-[12px] font-[600] text-[#111] block mb-1">Condition Notes</label>
                <input type="text" value={conditionDescription} onChange={(e) => setConditionDescription(e.target.value)}
                  className="w-full h-[35px] px-3 border border-[#a6a6a6] rounded text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]" placeholder="e.g. Minor scratch on back" />
              </div>
              <div className="800px:col-span-2">
                <label className="text-[12px] font-[600] text-[#111] block mb-1">Description</label>
                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-[#a6a6a6] rounded text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)] resize-none" placeholder="Describe your product..."></textarea>
              </div>
              <div className="800px:col-span-2">
                <label className="text-[12px] font-[600] text-[#111] block mb-1">Photos</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))}
                  className="text-[12px]" />
              </div>
              <div className="800px:col-span-2 flex gap-3">
                <button type="submit" disabled={creating}
                  className="h-[36px] px-6 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded text-[13px] font-[500] text-[#111] hover:from-[#f5d78e] hover:to-[#eeb933] disabled:opacity-50">
                  {creating ? "Listing..." : "List Product"}
                </button>
                <button type="button" onClick={() => setShowCreateForm(false)}
                  className="h-[36px] px-6 bg-gradient-to-b from-[#f7f8fa] to-[#e7e9ec] border border-[#adb1b8] rounded text-[13px] text-[#111]">
                  Cancel
                </button>
              </div>
            </form>
            <p className="text-[11px] text-[#4caf50] mt-3">🌱 You'll earn 60 Green Credits when your product sells!</p>
          </div>
        )}

        {/* Sort Bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13px] text-[#555]">{listings.length} listing{listings.length !== 1 ? "s" : ""} available</p>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-[12px] outline-none focus:border-[#ff9900]">
            <option value="newest">Newest First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-16"><p className="text-gray-500">Loading...</p></div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-[50px]">🤝</span>
            <h3 className="text-[20px] font-[600] text-[#131921] mt-4">No P2P listings yet</h3>
            <p className="text-gray-500 text-[14px] mt-2">Be the first to list a product for resale!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 800px:grid-cols-2 1000px:grid-cols-3 gap-5">
            {listings.map((listing) => (
              <div key={listing._id} className="bg-white border border-[#e7e7e7] rounded-lg overflow-hidden hover:shadow-md transition">
                {/* Image */}
                <div className="h-[180px] bg-[#f7f7f7] flex items-center justify-center p-4 relative">
                  {listing.images && listing.images.length > 0 ? (
                    <img src={getImageUrl(listing.images[0])} alt={listing.productName} className="max-h-[160px] object-contain" />
                  ) : (
                    <div className="text-[40px]">📦</div>
                  )}
                  <span className="absolute top-2 left-2 bg-[#232f3e] text-white text-[10px] font-[600] px-2 py-0.5 rounded">
                    P2P
                  </span>
                  {listing.conditionScore && (
                    <span className="absolute top-2 right-2 bg-[#00a86b] text-white text-[10px] font-[600] px-2 py-0.5 rounded">
                      {listing.conditionScore}/10
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="text-[14px] font-[500] text-[#0f1111] line-clamp-2 mb-1">{listing.productName}</h4>
                  <p className="text-[11px] text-[#555] mb-2">
                    Sold by <span className="font-[500]">{listing.sellerName}</span> • {listing.category}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-[18px] font-[600] text-[#131921]">₹{listing.askingPrice?.toLocaleString()}</span>
                    {listing.originalPrice && (
                      <span className="text-[12px] text-[#555] line-through">₹{listing.originalPrice?.toLocaleString()}</span>
                    )}
                  </div>

                  {listing.conditionDescription && (
                    <p className="text-[11px] text-[#555] mb-2">📋 {listing.conditionDescription}</p>
                  )}

                  {/* Interest count */}
                  {listing.interestedUsers?.length > 0 && (
                    <p className="text-[11px] text-[#c45500] font-[500] mb-2">
                      🔥 {listing.interestedUsers.length} people interested
                    </p>
                  )}

                  {/* Green Credits reward */}
                  <p className="text-[11px] text-[#4caf50] mb-3">🌱 Earn {listing.greenCreditsReward} credits on purchase</p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => handlePurchase(listing._id)}
                      className="flex-1 h-[30px] bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-[20px] text-[12px] font-[500] text-[#111] hover:from-[#f5d78e] hover:to-[#eeb933] transition">
                      Buy Now
                    </button>
                    <button onClick={() => handleInterest(listing._id)}
                      className="flex-1 h-[30px] bg-gradient-to-b from-[#f7f8fa] to-[#e7e9ec] border border-[#adb1b8] rounded-[20px] text-[12px] text-[#111] hover:from-[#e7eaf0] hover:to-[#d9dce1] transition">
                      I'm Interested
                    </button>
                  </div>
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

export default P2PMarketplacePage;
