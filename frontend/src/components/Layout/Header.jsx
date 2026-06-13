import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { RiLeafLine } from "react-icons/ri";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { backend_url } from "../../server";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";

const Header = ({ activeHeading }) => {
  const { isSeller } = useSelector((state) => state.seller);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  return (
    <>
      {/* Top Header - Dark Amazon style */}
      <div className="w-full bg-[#131921]">
        <div className={`${styles.section}`}>
          <div className="hidden 800px:h-[60px] 800px:flex items-center justify-between">
            {/* Logo */}
            <div>
              <Link to="/" className="flex items-center gap-2">
                <span className="text-[28px] font-[700] text-white font-Poppins">
                  amazon
                </span>
              </Link>
              <span className="text-[11px] text-[#ff9900] -mt-1 block">
                Second Life Commerce ♻️
              </span>
            </div>

            {/* Search box */}
            <div className="w-[45%] relative">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search products, refurbished deals..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="h-[42px] w-full px-3 rounded-l-md border-none outline-none text-[14px]"
                />
                <div className="h-[42px] w-[50px] bg-[#ff9900] hover:bg-[#e68a00] flex items-center justify-center rounded-r-md cursor-pointer">
                  <AiOutlineSearch size={22} color="#131921" />
                </div>
              </div>
              {searchData && searchData.length !== 0 ? (
                <div className="absolute min-h-[30vh] bg-white shadow-lg z-[9] p-4 w-full rounded-b-md">
                  {searchData.map((i, index) => (
                    <Link to={`/product/${i._id}`} key={index}>
                      <div className="w-full flex items-center py-2 hover:bg-gray-50 px-2 rounded">
                        <img
                          src={
                            i.images && i.images[0]
                              ? i.images[0].startsWith("http")
                                ? i.images[0]
                                : `${backend_url}${i.images[0]}`
                              : "https://via.placeholder.com/40"
                          }
                          alt=""
                          className="w-[40px] h-[40px] mr-[10px] object-contain"
                        />
                        <h1 className="text-sm text-[#131921]">{i.name}</h1>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
              {/* Green Credits */}
              <Link to="/green-credits" className="flex items-center gap-1 text-white hover:text-[#00a86b] transition">
                <RiLeafLine size={20} color="#00a86b" />
                <span className="text-[13px] text-gray-300">
                  <span className="block text-[11px]">Green Credits</span>
                  <span className="text-[#00a86b] font-semibold">0 🌱</span>
                </span>
              </Link>

              {/* Become Seller / Dashboard */}
              <div className="bg-[#ff9900] hover:bg-[#e68a00] px-4 py-2 rounded-md cursor-pointer transition">
                <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
                  <h1 className="text-[#131921] font-[600] text-[13px] flex items-center">
                    {isSeller ? "Dashboard" : "Become Seller"}{" "}
                    <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2nd Navigation Bar */}
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } transition hidden 800px:flex items-center justify-between w-full bg-[#232f3e] h-[50px]`}
      >
        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          {/* All Menu Button */}
          <div
            className="flex items-center gap-1 px-3 py-1 cursor-pointer border border-transparent hover:border-white rounded transition mr-4"
            onClick={() => setOpen(true)}
          >
            <BiMenuAltLeft size={22} color="white" />
            <span className="text-white text-[14px] font-[600]">All</span>
          </div>

          {/* NavItems */}
          <div className={`${styles.noramlFlex}`}>
            <Navbar active={activeHeading} />
          </div>

          {/* Icons */}
          <div className="flex">
            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={26} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#ff9900] w-4 h-4 p-0 m-0 text-[#131921] font-mono text-[11px] leading-tight text-center font-bold">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart size={26} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#ff9900] w-4 h-4 p-0 m-0 text-[#131921] font-mono text-[11px] leading-tight text-center font-bold">
                  {cart && cart.length}
                </span>
              </div>
            </div>

            {/* Avatar */}
            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={`${backend_url}${user.avatar}`}
                      className="w-[32px] h-[32px] rounded-full border-2 border-[#ff9900]"
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={26} color="rgb(255 255 255 / 83%)" />
                  </Link>
                )}
              </div>
            </div>

            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}
            {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } w-full h-[60px] bg-[#131921] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between px-4">
          <div>
            <BiMenuAltLeft
              size={35}
              className="text-white"
              onClick={() => setOpen(true)}
            />
          </div>
          <div>
            <Link to="/" className="flex items-center gap-1">
              <span className="text-[22px] font-[700] text-white font-Poppins">
                amazon
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative" onClick={() => setOpenCart(true)}>
              <AiOutlineShoppingCart size={28} color="white" />
              <span className="absolute right-0 top-0 rounded-full bg-[#ff9900] w-4 h-4 text-[#131921] font-mono text-[11px] leading-tight text-center font-bold">
                {cart && cart.length}
              </span>
            </div>
          </div>
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}
          {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {open ? (
        <div className="fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0">
          {/* Overlay close */}
          <div
            className="absolute w-full h-full"
            onClick={() => setOpen(false)}
          ></div>

          {/* Sidebar Panel */}
          <div className="fixed w-[80%] max-w-[365px] bg-white h-screen top-0 left-0 z-30 overflow-y-auto shadow-2xl">
            {/* Header - User greeting */}
            <div className="w-full flex items-center justify-between px-5 py-4 bg-[#232f3e]">
              <div className="flex items-center gap-3">
                <div className="w-[32px] h-[32px] rounded-full bg-[#37475a] flex items-center justify-center">
                  {isAuthenticated && user?.avatar ? (
                    <img
                      src={
                        user.avatar.startsWith("http")
                          ? user.avatar
                          : `${backend_url}${user.avatar}`
                      }
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <CgProfile size={22} color="white" />
                  )}
                </div>
                <span className="text-[16px] font-[700] text-white">
                  Hello, {isAuthenticated ? user?.name?.split(" ")[0] : "Sign in"}
                </span>
              </div>
              <RxCross1
                size={22}
                className="cursor-pointer text-white hover:text-[#ff9900] transition"
                onClick={() => setOpen(false)}
              />
            </div>

            {/* Trending Section */}
            <div className="border-b border-gray-200">
              <h3 className="text-[16px] font-[700] text-[#111] px-5 pt-4 pb-2">
                Trending
              </h3>
              <Link
                to="/best-selling"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-5 py-3 hover:bg-[#f7f7f7] transition"
              >
                <span className="text-[14px] text-[#111]">Bestsellers</span>
                <IoIosArrowForward size={16} color="#999" />
              </Link>
              <Link
                to="/products"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-5 py-3 hover:bg-[#f7f7f7] transition"
              >
                <span className="text-[14px] text-[#111]">New Releases</span>
                <IoIosArrowForward size={16} color="#999" />
              </Link>
            </div>

            {/* Second Life Section */}
            <div className="border-b border-gray-200">
              <h3 className="text-[16px] font-[700] text-[#111] px-5 pt-4 pb-2">
                Second Life ♻️
              </h3>
              <Link
                to="/refurbished"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-5 py-3 hover:bg-[#f7f7f7] transition"
              >
                <span className="text-[14px] text-[#111]">Certified Refurbished</span>
                <IoIosArrowForward size={16} color="#999" />
              </Link>
              <Link
                to="/return-portal"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-5 py-3 hover:bg-[#f7f7f7] transition"
              >
                <span className="text-[14px] text-[#111]">AI Return Portal</span>
                <IoIosArrowForward size={16} color="#999" />
              </Link>
              <Link
                to="/green-credits"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-5 py-3 hover:bg-[#f7f7f7] transition"
              >
                <span className="text-[14px] text-[#111]">Green Credits 🌱</span>
                <IoIosArrowForward size={16} color="#999" />
              </Link>
            </div>

            {/* Shop by Category */}
            <div className="border-b border-gray-200">
              <h3 className="text-[16px] font-[700] text-[#111] px-5 pt-4 pb-2">
                Shop by Category
              </h3>
              {categoriesData &&
                categoriesData.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.title}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-5 py-3 hover:bg-[#f7f7f7] transition"
                  >
                    <span className="text-[14px] text-[#111]">{category.title}</span>
                    <IoIosArrowForward size={16} color="#999" />
                  </Link>
                ))}
            </div>

            {/* Help & Settings */}
            <div className="border-b border-gray-200">
              <h3 className="text-[16px] font-[700] text-[#111] px-5 pt-4 pb-2">
                Help & Settings
              </h3>
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-5 py-3 hover:bg-[#f7f7f7] transition"
                >
                  <span className="text-[14px] text-[#111]">Your Account</span>
                  <IoIosArrowForward size={16} color="#999" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-5 py-3 hover:bg-[#f7f7f7] transition"
                >
                  <span className="text-[14px] text-[#111]">Sign In</span>
                  <IoIosArrowForward size={16} color="#999" />
                </Link>
              )}
              <Link
                to="/faq"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-5 py-3 hover:bg-[#f7f7f7] transition"
              >
                <span className="text-[14px] text-[#111]">FAQ</span>
                <IoIosArrowForward size={16} color="#999" />
              </Link>
              <Link
                to={`${isSeller ? "/dashboard" : "/shop-create"}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-5 py-3 hover:bg-[#f7f7f7] transition"
              >
                <span className="text-[14px] text-[#111]">
                  {isSeller ? "Seller Dashboard" : "Become a Seller"}
                </span>
                <IoIosArrowForward size={16} color="#999" />
              </Link>
            </div>

            {/* Bottom padding */}
            <div className="h-[60px]"></div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Header;
