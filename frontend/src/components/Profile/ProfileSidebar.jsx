import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import axios from "axios";
import { server, backend_url } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ProfileSidebar = ({ active, setActive }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const menuItems = [
    { id: 1, label: "My Profile", icon: RxPerson, action: () => setActive(1) },
    { id: 2, label: "My Orders", icon: HiOutlineShoppingBag, action: () => setActive(2) },
    { id: 3, label: "Refunds", icon: HiOutlineReceiptRefund, action: () => setActive(3) },
    { id: 4, label: "Inbox", icon: AiOutlineMessage, action: () => { setActive(4); navigate("/inbox"); } },
    { id: 5, label: "Track Orders", icon: MdOutlineTrackChanges, action: () => setActive(5) },
    { id: 6, label: "Change Password", icon: RiLockPasswordLine, action: () => setActive(6) },
    { id: 7, label: "Addresses", icon: TbAddressBook, action: () => setActive(7) },
  ];

  return (
    <div className="w-full bg-white border border-[#e7e7e7] rounded-lg overflow-hidden">
      {/* Profile Header */}
      <div className="p-4 border-b border-[#e7e7e7] bg-[#f7f7f7]">
        <div className="flex items-center gap-3">
          {user?.avatar && user.avatar !== "default-avatar.png" ? (
            <img
              src={
                user.avatar.startsWith("http")
                  ? user.avatar
                  : `${backend_url}${user?.avatar}`
              }
              alt=""
              className="w-[40px] h-[40px] rounded-full object-cover border-2 border-[#ff9900]"
            />
          ) : (
            <div className="w-[40px] h-[40px] rounded-full bg-[#232f3e] flex items-center justify-center border-2 border-[#ff9900]">
              <span className="text-white text-[16px] font-[600]">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
          )}
          <div className="hidden 800px:block">
            <p className="text-[11px] text-[#555]">Hello,</p>
            <p className="text-[14px] font-[600] text-[#131921] truncate max-w-[120px]">
              {user?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
                isActive
                  ? "bg-[#fff3e0] border-l-[3px] border-[#ff9900] text-[#c45500]"
                  : "border-l-[3px] border-transparent text-[#0f1111] hover:bg-[#f7f7f7]"
              }`}
              onClick={item.action}
            >
              <Icon size={18} color={isActive ? "#c45500" : "#555"} />
              <span className={`text-[13px] font-[${isActive ? "600" : "400"}] hidden 800px:block`}>
                {item.label}
              </span>
            </div>
          );
        })}

        {/* Admin Dashboard Link */}
        {user && user?.role === "Admin" && (
          <Link to="/admin/dashboard">
            <div
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-l-[3px] border-transparent text-[#0f1111] hover:bg-[#f7f7f7]`}
            >
              <MdOutlineAdminPanelSettings size={18} color="#555" />
              <span className="text-[13px] hidden 800px:block">Admin Dashboard</span>
            </div>
          </Link>
        )}

        {/* Divider */}
        <div className="border-t border-[#e7e7e7] my-2"></div>

        {/* Logout */}
        <div
          className="flex items-center gap-3 px-4 py-3 cursor-pointer text-[#0f1111] hover:bg-[#fce4ec] transition-all border-l-[3px] border-transparent"
          onClick={logoutHandler}
        >
          <AiOutlineLogin size={18} color="#c62828" />
          <span className="text-[13px] text-[#c62828] hidden 800px:block">Sign Out</span>
        </div>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
