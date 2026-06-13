import React, { useState } from "react";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import ProfileSideBar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";

const ProfilePage = () => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#eaeded] min-h-screen">
      <Header />
      <div className={`${styles.section} py-6`}>
        {/* Page Title */}
        <h1 className="text-[22px] font-[500] text-[#131921] mb-4">Your Account</h1>

        <div className="flex gap-5">
          {/* Sidebar */}
          <div className="w-[60px] 800px:w-[240px] flex-shrink-0">
            <div className="sticky top-[70px]">
              <ProfileSideBar active={active} setActive={setActive} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-[#e7e7e7] rounded-lg p-5">
              <ProfileContent active={active} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
