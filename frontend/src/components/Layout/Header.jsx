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
                          src={`${backend_url}${i.images[0]}`}
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
          {/* Categories */}
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[40px] mt-[5px] w-[230px] hidden 1000px:block">
              <BiMenuAltLeft size={24} className="absolute top-2 left-2 text-white" />
              <button
                className="h-[100%] w-full flex justify-between items-center pl-10 bg-[#37475a] text-white font-sans text-[14px] font-[500] select-none rounded"
              >
                All Categories
              </button>
              <IoIosArrowDown
                size={18}
                className="absolute right-2 top-3 cursor-pointer text-white"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
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
          <div className="fixed w-[75%] bg-white h-screen top-0 left-0 z-10 overflow-y-scroll">
            <div className="w-full justify-between flex pr-3 items-center p-4 bg-[#131921]">
              <Link to="/" className="flex items-center gap-1">
                <span className="text-[20px] font-[700] text-white font-Poppins">
                  amazon
                </span>
              </Link>
              <RxCross1
                size={25}
                className="cursor-pointer text-white"
                onClick={() => setOpen(false)}
              />
            </div>

            {/* Mobile Search */}
            <div className="my-4 w-[92%] m-auto">
              <input
                type="search"
                placeholder="Search products..."
                className="h-[40px] w-full px-3 border-2 border-[#ff9900] rounded-md text-sm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchData && searchData.length !== 0 && (
                <div className="absolute bg-white z-10 shadow w-full left-0 p-3">
                  {searchData.map((i, index) => (
                    <Link to={`/product/${i._id}`} key={index}>
                      <div className="flex items-center py-2">
                        <img
                          src={`${backend_url}${i.images[0]}`}
                          alt=""
                          className="w-[40px] mr-2 object-contain"
                        />
                        <h5 className="text-sm">{i.name}</h5>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Navbar active={activeHeading} />

            <div className="px-4 mt-4">
              <div className="bg-[#ff9900] px-4 py-3 rounded-md text-center">
                <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
                  <h1 className="text-[#131921] font-[600] text-[14px] flex items-center justify-center">
                    {isSeller ? "Go Dashboard" : "Become Seller"}{" "}
                    <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>
            </div>

            <div className="flex w-full justify-center mt-8">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={`${backend_url}${user.avatar}`}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full border-2 border-[#ff9900]"
                  />
                </Link>
              ) : (
                <div className="flex gap-4">
                  <Link to="/login" className="text-[16px] text-[#131921] font-medium">
                    Login
                  </Link>
                  <Link to="/sign-up" className="text-[16px] text-[#ff9900] font-medium">
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Header;
