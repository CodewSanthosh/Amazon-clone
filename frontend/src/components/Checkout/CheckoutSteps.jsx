import React from "react";

const CheckoutSteps = ({ active }) => {
  const steps = [
    { num: 1, label: "Address" },
    { num: 2, label: "Payment" },
    { num: 3, label: "Confirmation" },
  ];

  return (
    <div className="w-full flex justify-center py-6 bg-white border-b border-[#e7e7e7]">
      <div className="w-[90%] 800px:w-[50%] flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.num}>
            <div className="flex items-center gap-2">
              <div
                className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-[12px] font-[600] ${
                  active >= step.num
                    ? "bg-[#ff9900] text-[#131921]"
                    : "bg-[#e7e7e7] text-[#555]"
                }`}
              >
                {active > step.num ? "✓" : step.num}
              </div>
              <span
                className={`text-[13px] font-[500] hidden 800px:block ${
                  active >= step.num ? "text-[#131921]" : "text-[#999]"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-[3px] mx-3 rounded ${
                  active > step.num ? "bg-[#ff9900]" : "bg-[#e7e7e7]"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;
