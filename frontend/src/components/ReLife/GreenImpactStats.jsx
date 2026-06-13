import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import axios from "axios";
import { server } from "../../server";

const GreenImpactStats = () => {
  const [stats, setStats] = useState({
    productsReused: "12,450",
    co2Saved: "5.2 Tons",
    revenueRecovered: "₹23,40,000",
    returnsPrevented: "3,200",
    greenCreditsEarned: "89,000",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${server}/green-credits/stats`);
        if (res.data.success) {
          const s = res.data.stats;
          setStats({
            productsReused: s.productsReused.toLocaleString(),
            co2Saved: s.co2Saved,
            revenueRecovered: `₹${s.revenueRecovered.toLocaleString()}`,
            returnsPrevented: s.returnsPrevented.toLocaleString(),
            greenCreditsEarned: s.greenCreditsEarned.toLocaleString(),
          });
        }
      } catch (err) {
        // Use defaults if API fails
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    { icon: "📦", value: stats.productsReused, label: "Products Reused" },
    { icon: "🌍", value: stats.co2Saved, label: "CO₂ Emissions Saved" },
    { icon: "💰", value: stats.revenueRecovered, label: "Revenue Recovered" },
    { icon: "🚫", value: stats.returnsPrevented, label: "Returns Prevented" },
    { icon: "🌱", value: stats.greenCreditsEarned, label: "Green Credits Earned" },
  ];

  return (
    <div className="w-full bg-[#131921] py-6">
      <div className={`${styles.section}`}>
        <div className="flex items-center justify-between overflow-x-auto gap-4 py-2">
          {statItems.map((stat, index) => (
            <div key={index} className="flex items-center gap-3 min-w-[180px]">
              <span className="text-[24px]">{stat.icon}</span>
              <div>
                <h4 className="text-[18px] font-[700] font-Poppins text-[#ff9900]">
                  {stat.value}
                </h4>
                <p className="text-gray-400 text-[11px] whitespace-nowrap">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GreenImpactStats;
