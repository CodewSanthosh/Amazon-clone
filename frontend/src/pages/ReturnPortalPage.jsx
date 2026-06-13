import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { server } from "../server";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ReturnPortalPage = () => {
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [productName, setProductName] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleGrade = async () => {
    setGrading(true);
    setError(null);
    setStep(2);

    try {
      const formData = new FormData();
      formData.append("images", imageFile);
      formData.append("productName", productName || "Product");
      formData.append("returnReason", returnReason || "Not specified");
      formData.append("productCategory", productCategory || "General");
      
      if (isAuthenticated && user) {
        formData.append("userId", user._id);
        formData.append("user", JSON.stringify({ name: user.name, email: user.email }));
      }

      const response = await axios.post(`${server}/ai/grade-product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setResult(response.data.result);
        setStep(3);
      } else {
        throw new Error("AI grading failed");
      }
    } catch (err) {
      console.error("AI Grading Error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to grade product. Please try again."
      );
      setStep(1);
    } finally {
      setGrading(false);
    }
  };

  return (
    <div>
      <Header activeHeading={4} />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#131921] to-[#232f3e] py-10">
        <div className={`${styles.section} text-center`}>
          <h1 className="text-[28px] 800px:text-[36px] font-[700] text-white font-Poppins">
            AI Return Portal ♻️
          </h1>
          <p className="text-gray-300 text-[15px] mt-2 max-w-[600px] mx-auto">
            Upload photos of your product and our AI will instantly grade its condition, 
            generate a Health Card, and decide the best sustainable path forward.
          </p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className={`${styles.section} py-8`}>
        <div className="flex items-center justify-center gap-4 mb-10">
          {[
            { num: 1, label: "Upload Photos" },
            { num: 2, label: "AI Analysis" },
            { num: 3, label: "Result & Routing" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s.num
                    ? "bg-[#ff9900] text-[#131921]"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span className={`text-[13px] font-medium ${step >= s.num ? "text-[#131921]" : "text-gray-400"}`}>
                {s.label}
              </span>
              {s.num < 3 && <span className="text-gray-300 mx-2">→</span>}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-[600px] mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-[14px]">
            ⚠️ {error}
          </div>
        )}

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="max-w-[600px] mx-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-[#ff9900] transition">
              {selectedImage ? (
                <div>
                  <img src={selectedImage} alt="Uploaded product" className="max-h-[250px] mx-auto rounded-lg mb-4" />
                  <p className="text-[#00a86b] font-medium text-sm">✓ Image uploaded successfully</p>
                </div>
              ) : (
                <div>
                  <span className="text-[50px]">📸</span>
                  <h3 className="text-[18px] font-[600] text-[#131921] mt-4">
                    Upload Product Photos
                  </h3>
                  <p className="text-gray-500 text-[13px] mt-2">
                    Take clear photos from multiple angles for best AI grading accuracy
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-4 text-sm"
              />
            </div>

            {/* Product Name */}
            <div className="mt-6">
              <label className="text-[14px] font-[600] text-[#131921] block mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. iPhone 14 Pro, Sony Headphones..."
                className="w-full border border-gray-300 rounded-md p-3 text-[14px]"
              />
            </div>

            {/* Product Category */}
            <div className="mt-4">
              <label className="text-[14px] font-[600] text-[#131921] block mb-2">
                Product Category
              </label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 text-[14px]"
              >
                <option value="">Select category...</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing & Fashion</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports & Fitness</option>
                <option value="Beauty">Beauty & Personal Care</option>
                <option value="Toys">Toys & Games</option>
                <option value="Accessories">Accessories</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Return reason */}
            <div className="mt-4">
              <label className="text-[14px] font-[600] text-[#131921] block mb-2">
                Return Reason
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 text-[14px]"
              >
                <option value="">Select reason...</option>
                <option value="Not as described">Not as described</option>
                <option value="Size/fit issue">Size/fit issue</option>
                <option value="Defective/damaged">Defective/damaged</option>
                <option value="Changed my mind">Changed my mind</option>
                <option value="Found better price">Found better price</option>
                <option value="No longer needed">No longer needed</option>
              </select>
            </div>

            <button
              onClick={handleGrade}
              disabled={!selectedImage}
              className={`w-full mt-6 py-3 rounded-md font-semibold text-[15px] transition ${
                selectedImage
                  ? "bg-[#ff9900] hover:bg-[#e68a00] text-[#131921] cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Analyze with AI 🤖
            </button>
          </div>
        )}

        {/* Step 2: AI Processing */}
        {step === 2 && grading && (
          <div className="max-w-[500px] mx-auto text-center py-10">
            <div className="animate-pulse">
              <span className="text-[60px]">🤖</span>
              <h3 className="text-[20px] font-[600] text-[#131921] mt-4">
                AI is analyzing your product...
              </h3>
              <p className="text-gray-500 text-[14px] mt-2">
                Detecting defects, grading condition, generating Health Card
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 justify-center text-[13px]">
                  <span className="animate-spin">⚙️</span>
                  <span className="text-gray-600">Scanning for defects with Gemini AI...</span>
                </div>
                <div className="flex items-center gap-3 justify-center text-[13px]">
                  <span className="animate-spin">⚙️</span>
                  <span className="text-gray-600">Computing condition score...</span>
                </div>
                <div className="flex items-center gap-3 justify-center text-[13px]">
                  <span className="animate-spin">⚙️</span>
                  <span className="text-gray-600">Determining optimal sustainable route...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <div className="max-w-[800px] mx-auto">
            <div className="grid grid-cols-1 800px:grid-cols-2 gap-6">
              {/* Left: Health Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-[700] text-[16px] text-[#131921]">AI Health Card</h3>
                  <span className="bg-[#e8f5e9] text-[#00a86b] px-2 py-1 rounded text-[11px] font-bold">
                    VERIFIED ✓
                  </span>
                </div>

                {/* Image */}
                {selectedImage && (
                  <img src={selectedImage} alt="Product" className="w-full h-[150px] object-contain bg-gray-50 rounded-lg mb-4" />
                )}

                {/* Condition Score */}
                <div className="mb-4">
                  <div className="flex justify-between text-[13px] mb-1">
                    <span className="text-gray-500">Condition Score</span>
                    <span className="font-bold text-[#00a86b]">{result.conditionScore}/10</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff9900] to-[#00a86b] rounded-full transition-all duration-1000"
                      style={{ width: `${result.conditionScore * 10}%` }}
                    ></div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trust Score</span>
                    <span className="font-medium text-[#1976d2]">{result.trustScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">AI Confidence</span>
                    <span className="font-medium text-[#00a86b]">{result.aiConfidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Suggested Price</span>
                    <span className="font-bold">₹{result.suggestedPrice?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Defects */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <h4 className="text-[12px] font-[600] text-gray-600 mb-2">Detected Defects:</h4>
                  {result.defects && result.defects.length > 0 ? (
                    result.defects.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-[12px] text-gray-500 mb-1">
                        <span className="w-2 h-2 rounded-full bg-[#ff9900]"></span>
                        <span>{d.type} — {d.severity} ({d.location})</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[12px] text-[#00a86b]">✓ No defects detected</p>
                  )}
                </div>
              </div>

              {/* Right: Routing Decision */}
              <div>
                {/* Decision */}
                <div className="bg-[#e8f5e9] rounded-xl p-6 mb-4">
                  <h3 className="font-[600] text-[14px] text-gray-600 mb-1">Smart Routing Decision</h3>
                  <p className="text-[20px] font-[700] text-[#00a86b]">
                    {result.decision}
                  </p>
                  <p className="text-[13px] text-gray-600 mt-3 leading-relaxed">
                    {result.reasoning}
                  </p>
                </div>

                {/* Rewards */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
                  <h3 className="font-[600] text-[14px] text-[#131921] mb-3">Your Rewards 🎉</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-gray-600">🌱 Green Credits Earned</span>
                      <span className="font-bold text-[#4caf50] text-[16px]">+{result.greenCreditsEarned}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-gray-600">🌍 CO₂ Saved</span>
                      <span className="font-bold text-[#00a86b]">{result.co2Saved}</span>
                    </div>
                  </div>
                </div>

                {/* Powered by badge */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-center">
                  <span className="text-[11px] text-gray-500">
                    🤖 Powered by Google Gemini AI • Graded {new Date().toLocaleDateString()}
                  </span>
                </div>

                {/* Action buttons */}
                {confirmed ? (
                  <div className="w-full bg-[#e8f5e9] border border-[#4caf50] rounded-md py-4 px-5 text-center">
                    <span className="text-[20px]">✅</span>
                    <p className="text-[15px] font-[600] text-[#2e7d32] mt-1">Return Confirmed!</p>
                    <p className="text-[12px] text-[#555] mt-1">
                      Your product will be routed to: <strong>{result.decision}</strong>
                    </p>
                    <p className="text-[12px] text-[#4caf50] mt-1">
                      +{result.greenCreditsEarned} Green Credits added to your account 🌱
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      setConfirming(true);
                      try {
                        // Award green credits
                        if (isAuthenticated && user) {
                          await axios.post(`${server}/green-credits/earn`, {
                            userId: user._id,
                            amount: result.greenCreditsEarned,
                            action: "return_graded",
                            description: `Return graded: ${productName || "Product"} → ${result.decision}`,
                            co2Saved: result.co2Saved?.replace(" kg", "") || "1.0",
                          });
                        }
                        toast.success("Return confirmed! Green Credits have been awarded 🌱");
                        setConfirmed(true);
                      } catch (err) {
                        toast.error("Failed to confirm return");
                      } finally {
                        setConfirming(false);
                      }
                    }}
                    disabled={confirming}
                    className="w-full bg-[#ff9900] hover:bg-[#e68a00] text-[#131921] font-semibold py-3 rounded-md text-[14px] transition disabled:opacity-50"
                  >
                    {confirming ? "Confirming..." : "Confirm Return ✓"}
                  </button>
                )}
                <button
                  onClick={() => { setStep(1); setSelectedImage(null); setImageFile(null); setResult(null); setError(null); setConfirmed(false); }}
                  className="w-full mt-2 border border-gray-300 text-gray-600 py-3 rounded-md text-[14px] hover:bg-gray-50 transition"
                >
                  Try Another Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ReturnPortalPage;
