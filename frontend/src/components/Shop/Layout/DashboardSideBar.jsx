import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

const DashboardSideBar = ({ active }) => {
  const menuItems = [
    { id: 1, label: "Dashboard", icon: RxDashboard, link: "/dashboard" },
    { id: 2, label: "Orders", icon: FiShoppingBag, link: "/dashboard-orders" },
    { id: 3, label: "Products", icon: FiPackage, link: "/dashboard-products" },
    { id: 4, label: "Add Product", icon: AiOutlineFolderAdd, link: "/dashboard-create-product" },
    { id: 5, label: "Events", icon: MdOutlineLocalOffer, link: "/dashboard-events" },
    { id: 6, label: "Create Event", icon: VscNewFile, link: "/dashboard-create-event" },
    { id: 7, label: "Payments", icon: CiMoneyBill, link: "/dashboard-withdraw-money" },
    { id: 8, label: "Messages", icon: BiMessageSquareDetail, link: "/dashboard-messages" },
    { id: 9, label: "Coupons", icon: AiOutlineGift, link: "/dashboard-coupouns" },
    { id: 10, label: "Refunds", icon: HiOutlineReceiptRefund, link: "/dashboard-refunds" },
    { id: 11, label: "Settings", icon: CiSettings, link: "/settings" },
  ];

  return (
    <div className="w-full h-[calc(100vh-56px)] bg-[#232f3e] overflow-y-auto sticky top-[56px] left-0 z-10">
      {/* Menu Label */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-[10px] font-[600] text-gray-400 uppercase tracking-wider">
          Menu
        </p>
      </div>

      {/* Menu Items */}
      <nav className="px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <Link
              key={item.id}
              to={item.link}
              className={`w-full flex items-center gap-3 px-3 py-[10px] rounded-md mb-[2px] transition-all duration-150
                ${isActive
                  ? "bg-[#ff9900] bg-opacity-10 border-l-[3px] border-[#ff9900] text-[#ff9900]"
                  : "border-l-[3px] border-transparent text-gray-300 hover:bg-[#2a3a4e] hover:text-white"
                }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-[#ff9900]" : "text-gray-400"}
              />
              <span
                className={`hidden 800px:block text-[13px] font-[${isActive ? "500" : "400"}]`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-4 mt-4 pt-4 border-t border-[#374151]">
        <div className="bg-[#1a2535] rounded-lg p-3 hidden 800px:block">
          <p className="text-[11px] text-gray-400 mb-1">Seller Performance</p>
          <div className="flex items-center gap-2">
            <div className="w-full h-[4px] bg-[#374151] rounded-full overflow-hidden">
              <div className="h-full bg-[#ff9900] rounded-full" style={{ width: "78%" }}></div>
            </div>
            <span className="text-[11px] text-[#ff9900] font-[600]">78%</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-1">Good standing</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSideBar;
