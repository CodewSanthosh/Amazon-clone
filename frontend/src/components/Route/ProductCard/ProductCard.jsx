import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url } from "../../../server";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id]);

  const removeFromWishlistHandler = (data) => {
    setClick(false);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(true);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart!");
      }
    }
  };

  const discount = data.originalPrice
    ? Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)
    : 0;

  const productLink = isEvent
    ? `/product/${data._id}?isEvent=true`
    : `/product/${data._id}`;

  return (
    <div className="w-full bg-white border border-[#e7e7e7] rounded-md overflow-hidden hover:shadow-md transition-all duration-200 group relative">
      {/* Wishlist Icon */}
      <div className="absolute top-2 right-2 z-10">
        {click ? (
          <AiFillHeart
            size={20}
            className="cursor-pointer"
            onClick={() => removeFromWishlistHandler(data)}
            color="#e53935"
            title="Remove from wishlist"
          />
        ) : (
          <AiOutlineHeart
            size={20}
            className="cursor-pointer text-gray-400 hover:text-[#e53935] transition"
            onClick={() => addToWishlistHandler(data)}
            title="Add to wishlist"
          />
        )}
      </div>

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-[#cc0c39] text-white text-[11px] font-[700] px-2 py-0.5 rounded-sm">
          {discount}% off
        </div>
      )}

      {/* Image */}
      <Link to={productLink}>
        <div className="w-full h-[200px] flex items-center justify-center p-4 bg-white">
          <img
            src={
              data.images && data.images[0]
                ? data.images[0].startsWith("http")
                  ? data.images[0]
                  : `${backend_url}${data.images[0]}`
                : "https://via.placeholder.com/200"
            }
            alt={data.name}
            className="max-h-[180px] max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="px-3 pb-3 pt-2 border-t border-[#f0f0f0]">
        {/* Title */}
        <Link to={productLink}>
          <h4 className="text-[13px] text-[#0f1111] leading-[1.4] font-[400] hover:text-[#c45500] transition line-clamp-2 mb-1">
            {data.name}
          </h4>
        </Link>

        {/* Ratings */}
        <div className="flex items-center gap-1 mb-1">
          <Ratings rating={data?.ratings} />
          <span className="text-[11px] text-[#007185]">
            ({data?.sold_out || 0})
          </span>
        </div>

        {/* Price */}
        <div className="mb-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] text-[#0f1111]">₹</span>
            <span className="text-[20px] font-[500] text-[#0f1111]">
              {data.discountPrice?.toLocaleString()}
            </span>
          </div>
          {data.originalPrice > 0 && data.originalPrice !== data.discountPrice && (
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] text-[#565959] line-through">
                M.R.P: ₹{data.originalPrice?.toLocaleString()}
              </span>
              <span className="text-[12px] text-[#cc0c39] font-[500]">
                ({discount}% off)
              </span>
            </div>
          )}
        </div>

        {/* Delivery */}
        <p className="text-[12px] text-[#565959] mb-2">
          FREE delivery by <span className="font-[500] text-[#0f1111]">Tomorrow</span>
        </p>

        {/* Add to Cart */}
        <button
          onClick={() => addToCartHandler(data._id)}
          className="w-full h-[30px] bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-[20px] text-[12px] font-[400] text-[#0f1111] cursor-pointer hover:from-[#f5d78e] hover:to-[#eeb933] transition flex items-center justify-center gap-1"
        >
          <AiOutlineShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
