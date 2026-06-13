import React from "react";
import styles from "../../styles/styles";

const steps = [
  {
    icon: "📦",
    title: "Return Product",
    description: "Upload photos of your returned item through our AI portal",
    color: "#ff9900",
  },
  {
    icon: "🤖",
    title: "AI Grades & Routes",
    description: "AI analyzes condition, generates Health Card & decides next path",
    color: "#ff9900",
  },
  {
    icon: "♻️",
    title: "Second Life",
    description: "Product is resold, refurbished, donated, or recycled intelligently",
    color: "#ff9900",
  },
  {
    icon: "🌱",
    title: "Earn Green Credits",
    description: "Get rewarded for sustainable choices with redeemable credits",
    color: "#ff9900",
  },
];

const HowItWorks = () => {
  return (
    <div className="w-full bg-[#f8f9fa] py-12">
      <div className={`${styles.section}`}>
        <h2 className={`${styles.sectionHeading} text-center`}>
          How <span className="text-[#ff9900]">Amazon Second Life</span> Works
        </h2>
        <p className="text-center text-gray-500 mb-10 text-[15px]">
          Every returned product gets an intelligent second chance
        </p>

        <div className="grid grid-cols-1 800px:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-200 h-full">
                {/* Step number */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto mb-3"
                  style={{ backgroundColor: step.color }}
                >
                  {index + 1}
                </div>
                {/* Icon */}
                <div className="text-[40px] mb-3">{step.icon}</div>
                {/* Title */}
                <h3 className="font-[600] text-[16px] text-[#131921] mb-2">
                  {step.title}
                </h3>
                {/* Description */}
                <p className="text-gray-500 text-[13px] leading-relaxed">
                  {step.description}
                </p>
              </div>
              {/* Arrow connector (hidden on last item and mobile) */}
              {index < 3 && (
                <div className="hidden 800px:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-300 text-[20px]">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
