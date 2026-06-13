import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../server";

const ReturnPrevention = ({ productName, productCategory, productPrice, productDescription }) => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const res = await axios.post(`${server}/ai/return-risk`, {
          productName,
          productCategory: productCategory || "General",
          productPrice: productPrice || 0,
          productDescription: productDescription || "",
        });
        if (res.data.success) {
          setRiskData(res.data);
        }
      } catch (err) {
        // Silently fail — don't break the page
        console.log("Return risk fetch failed:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productName) {
      fetchRisk();
    } else {
      setLoading(false);
    }
  }, [productName]);

  if (loading || !riskData) return null;

  const getRiskColor = (level) => {
    if (level === "low") return { bg: "#e8f5e9", text: "#2e7d32", bar: "#4caf50" };
    if (level === "medium") return { bg: "#fff3e0", text: "#e65100", bar: "#ff9800" };
    return { bg: "#fce4ec", text: "#c62828", bar: "#f44336" };
  };

  const colors = getRiskColor(riskData.riskLevel);

  return (
    <div
      className="mt-4 rounded-lg border overflow-hidden"
      style={{ borderColor: colors.bar + "40", backgroundColor: colors.bg }}
    >
      {/* Header - Always Visible */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-[16px]">
            {riskData.riskLevel === "low" ? "✅" : riskData.riskLevel === "medium" ? "⚠️" : "🚨"}
          </span>
          <div>
            <p className="text-[13px] font-[600]" style={{ color: colors.text }}>
              {riskData.returnProbability}% of buyers return this type of product
            </p>
            <p className="text-[11px] text-gray-500">
              AI-powered return prediction • Keep it & earn Green Credits 🌱
            </p>
          </div>
        </div>
        <span className="text-[12px] text-gray-400">
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t" style={{ borderColor: colors.bar + "30" }}>
          {/* Risk Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-gray-500">Return Risk</span>
              <span className="font-[600]" style={{ color: colors.text }}>
                {riskData.riskLevel.toUpperCase()} ({riskData.returnProbability}%)
              </span>
            </div>
            <div className="w-full h-[6px] bg-white rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${riskData.returnProbability}%`, backgroundColor: colors.bar }}
              ></div>
            </div>
          </div>

          {/* Common Return Reasons */}
          <div className="mb-3">
            <p className="text-[11px] font-[600] text-gray-600 mb-1">Common return reasons:</p>
            <ul className="space-y-1">
              {riskData.topReasons?.map((reason, i) => (
                <li key={i} className="text-[11px] text-gray-500 flex items-start gap-1.5">
                  <span className="text-[8px] mt-[4px]">●</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prevention Tips */}
          <div className="mb-3">
            <p className="text-[11px] font-[600] text-gray-600 mb-1">Tips before you buy:</p>
            <ul className="space-y-1">
              {riskData.preventionTips?.map((tip, i) => (
                <li key={i} className="text-[11px] text-gray-500 flex items-start gap-1.5">
                  <span className="text-[#ff9900]">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Keep Incentive */}
          <div className="bg-white rounded-md p-3 border border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-[14px]">🌱</span>
              <p className="text-[12px] text-[#2e7d32] font-[500] leading-relaxed">
                {riskData.keepIncentive}
              </p>
            </div>
            <p className="text-[11px] text-[#ff9900] font-[600] mt-2">
              +20 Green Credits if you keep this product instead of returning
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnPrevention;
