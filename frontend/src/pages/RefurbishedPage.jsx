import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";

const RefurbishedPage = () => {
  // Mock refurbished products for demo
  const refurbishedProducts = [
    {
      id: 1,
      name: "iPhone 14 Pro - Certified Refurbished",
      originalPrice: 79999,
      refurbPrice: 54999,
      conditionScore: 9.2,
      trustScore: 96,
      image: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
      defects: "Minor micro-scratch on back panel",
      greenCredits: 80,
      savedCO2: "2.1 kg",
    },
    {
      id: 2,
      name: "MacBook Pro M2 - Certified Refurbished",
      originalPrice: 129900,
      refurbPrice: 89999,
      conditionScore: 8.7,
      trustScore: 94,
      image: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
      defects: "Light wear on palm rest area",
      greenCredits: 120,
      savedCO2: "4.5 kg",
    },
    {
      id: 3,
      name: "Sony WH-1000XM5 - Certified Refurbished",
      originalPrice: 29990,
      refurbPrice: 18999,
      conditionScore: 9.5,
      trustScore: 98,
      image: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
      defects: "No visible defects",
      greenCredits: 40,
      savedCO2: "0.8 kg",
    },
    {
      id: 4,
      name: "Samsung Galaxy Watch 5 - Certified Refurbished",
      originalPrice: 27999,
      refurbPrice: 16499,
      conditionScore: 8.9,
      trustScore: 95,
      image: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
      defects: "Faint scratch on bezel",
      greenCredits: 35,
      savedCO2: "0.5 kg",
    },
  ];

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
          <div className="flex gap-4 mt-4">
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

      {/* Products Grid */}
      <div className={`${styles.section} py-8`}>
        <div className="grid grid-cols-1 800px:grid-cols-2 1000px:grid-cols-4 gap-6">
          {refurbishedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              {/* Badge */}
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-[180px] object-contain p-4 bg-gray-50" />
                <span className="absolute top-3 left-3 bg-[#00a86b] text-white text-[10px] font-bold px-2 py-1 rounded">
                  CERTIFIED ♻️
                </span>
                <span className="absolute top-3 right-3 bg-[#1976d2] text-white text-[10px] font-bold px-2 py-1 rounded">
                  {product.conditionScore}/10
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-[600] text-[14px] text-[#131921] mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[18px] font-bold text-[#131921]">₹{product.refurbPrice.toLocaleString()}</span>
                  <span className="text-[13px] text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="text-[12px] font-bold text-[#00a86b]">
                    {Math.round((1 - product.refurbPrice/product.originalPrice) * 100)}% off
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
                  📋 {product.defects}
                </p>

                {/* Green credits */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-[11px] text-[#4caf50] font-medium">
                    🌱 Earn {product.greenCredits} credits
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Saves {product.savedCO2} CO₂
                  </span>
                </div>

                {/* CTA */}
                <button className="w-full mt-3 bg-[#ff9900] hover:bg-[#e68a00] text-[#131921] font-semibold py-2 rounded-md text-[13px] transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RefurbishedPage;
