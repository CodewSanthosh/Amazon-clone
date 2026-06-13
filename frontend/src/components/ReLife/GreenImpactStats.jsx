import React from "react";
import styles from "../../styles/styles";

const stats = [
  {
    icon: "📦",
    value: "12,450",
    label: "Products Reused",
    color: "#ff9900",
  },
  {
    icon: "🌍",
    value: "5.2 Tons",
    label: "CO₂ Emissions Saved",
    color: "#ff9900",
  },
  {
    icon: "💰",
    value: "₹23,40,000",
    label: "Revenue Recovered",
    color: "#ff9900",
  },
  {
    icon: "🚫",
    value: "3,200",
    label: "Returns Prevented",
    color: "#ff9900",
  },
  {
    icon: "🌱",
    value: "89,000",
    label: "Green Credits Earned",
    color: "#ff9900",
  },
];

const GreenImpactStats = () => {
  return (
    <div className="w-full bg-[#131921] py-6">
      <div className={`${styles.section}`}>
        <div className="flex items-center justify-between overflow-x-auto gap-4 py-2">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-3 min-w-[180px]"
            >
              <span className="text-[24px]">{stat.icon}</span>
              <div>
                <h4
                  className="text-[18px] font-[700] font-Poppins"
                  style={{ color: stat.color }}
                >
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
