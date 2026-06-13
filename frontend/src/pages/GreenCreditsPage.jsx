import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { server } from "../server";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const GreenCreditsPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [impact, setImpact] = useState({ co2Saved: "0 kg", productsReused: 0, returnsAvoided: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCredits();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchCredits = async () => {
    try {
      const [balanceRes, historyRes] = await Promise.all([
        axios.get(`${server}/green-credits/balance/${user._id}`),
        axios.get(`${server}/green-credits/history/${user._id}`),
      ]);

      if (balanceRes.data.success) {
        setBalance(balanceRes.data.balance);
        setTotalEarned(balanceRes.data.totalEarned);
        setTotalSpent(balanceRes.data.totalSpent);
        setImpact(balanceRes.data.impact);
      }
      if (historyRes.data.success) {
        setTransactions(historyRes.data.transactions);
      }
    } catch (err) {
      console.log("Credits fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (amount) => {
    if (!isAuthenticated) {
      toast.error("Please login to redeem credits");
      return;
    }
    if (balance < amount) {
      toast.error("Insufficient credits");
      return;
    }
    try {
      const res = await axios.post(`${server}/green-credits/redeem`, {
        userId: user._id,
        amount,
        description: `Redeemed ${amount} credits for ₹${Math.floor(amount / 2)} discount`,
      });
      if (res.data.success) {
        toast.success(`Redeemed! You get ₹${res.data.discountValue} off your next order`);
        setBalance(res.data.newBalance);
        fetchCredits();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Redeem failed");
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      bought_refurbished: "♻️",
      donated_return: "🎁",
      sold_p2p: "🤝",
      kept_product: "💚",
      return_graded: "🤖",
      redeemed: "🛒",
      welcome_bonus: "🎉",
    };
    return icons[action] || "🌱";
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <Header activeHeading={5} />

      {/* Page Header */}
      <div className="bg-[#131921] py-10">
        <div className={`${styles.section} text-center`}>
          <h1 className="text-[28px] 800px:text-[36px] font-[700] text-white font-Poppins">
            Green Credits 🌱
          </h1>
          <p className="text-gray-300 text-[15px] mt-2">
            Earn rewards for every sustainable choice you make
          </p>
        </div>
      </div>

      <div className={`${styles.section} py-8`}>
        {!isAuthenticated ? (
          <div className="text-center py-16">
            <span className="text-[50px]">🌱</span>
            <h3 className="text-[20px] font-[600] text-[#131921] mt-4">Login to view your Green Credits</h3>
            <p className="text-gray-500 text-[14px] mt-2">Earn credits for sustainable shopping choices</p>
          </div>
        ) : loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Loading your credits...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 800px:grid-cols-3 gap-6 mb-10">
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-[#ff9900] to-[#e68a00] rounded-xl p-6 text-[#131921]">
                <h3 className="text-[14px] font-medium opacity-80">Your Balance</h3>
                <p className="text-[42px] font-[800] mt-2">{balance}</p>
                <p className="text-[14px] font-semibold">Green Credits 🌱</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleRedeem(100)}
                    disabled={balance < 100}
                    className="bg-[#131921] text-[#ff9900] px-4 py-2 rounded-md text-[12px] font-semibold disabled:opacity-40 hover:bg-[#232f3e] transition"
                  >
                    Redeem 100 → ₹50 off
                  </button>
                  <button
                    onClick={() => handleRedeem(200)}
                    disabled={balance < 200}
                    className="bg-[#131921] text-[#ff9900] px-4 py-2 rounded-md text-[12px] font-semibold disabled:opacity-40 hover:bg-[#232f3e] transition"
                  >
                    Redeem 200 → ₹100 off
                  </button>
                </div>
              </div>

              {/* Impact Card */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-[14px] font-medium text-gray-500">Your Impact</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-gray-600">🌍 CO₂ Saved</span>
                    <span className="font-bold text-[#ff9900]">{impact.co2Saved}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-gray-600">📦 Products Reused</span>
                    <span className="font-bold text-[#ff9900]">{impact.productsReused}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-gray-600">🚫 Returns Avoided</span>
                    <span className="font-bold text-[#ff9900]">{impact.returnsAvoided}</span>
                  </div>
                </div>
              </div>

              {/* How to Earn */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-[14px] font-medium text-gray-500">How to Earn</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="bg-[#fff3e0] text-[#ff9900] w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]">+30</span>
                    <span className="text-gray-600">Buy refurbished products</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="bg-[#fff3e0] text-[#ff9900] w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]">+75</span>
                    <span className="text-gray-600">Donate usable returns</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="bg-[#fff3e0] text-[#ff9900] w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]">+60</span>
                    <span className="text-gray-600">Sell via peer-to-peer</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="bg-[#fff3e0] text-[#ff9900] w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]">+20</span>
                    <span className="text-gray-600">Avoid a predicted return</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-[600] text-[16px] text-[#131921]">Credit History</h3>
                <span className="text-[12px] text-gray-400">
                  {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
                </span>
              </div>
              {transactions.length === 0 ? (
                <div className="p-8 text-center">
                  <span className="text-[30px]">🌱</span>
                  <p className="text-[14px] text-gray-500 mt-2">
                    No transactions yet. Start earning by using the Return Portal or buying refurbished!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {transactions.map((item) => (
                    <div key={item._id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] ${
                          item.amount > 0 ? "bg-[#fff3e0] text-[#ff9900]" : "bg-gray-100 text-gray-500"
                        }`}>
                          {getActionIcon(item.action)}
                        </span>
                        <div>
                          <p className="text-[13px] font-medium text-[#131921]">{item.description}</p>
                          <p className="text-[11px] text-gray-400">{formatDate(item.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`font-[700] text-[14px] ${
                        item.amount > 0 ? "text-[#ff9900]" : "text-gray-500"
                      }`}>
                        {item.amount > 0 ? "+" : ""}{item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default GreenCreditsPage;
