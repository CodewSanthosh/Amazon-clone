import React from "react";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { getImageUrl } from "../../utils/imageUrl";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addTocart(newData));
    setOpenWishlist(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[#00000066] z-[100]">
      {/* Overlay click to close */}
      <div className="absolute w-full h-full" onClick={() => setOpenWishlist(false)}></div>

      {/* Wishlist Panel */}
      <div className="fixed top-0 right-0 h-full w-[90%] 800px:w-[380px] bg-white flex flex-col z-[101] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e7e7e7] bg-[#f7f7f7]">
          <div className="flex items-center gap-2">
            <AiOutlineHeart size={22} color="#e53935" />
            <h3 className="text-[16px] font-[600] text-[#131921]">
              Wishlist ({wishlist?.length || 0})
            </h3>
          </div>
          <RxCross1
            size={20}
            className="cursor-pointer text-[#555] hover:text-[#131921] transition"
            onClick={() => setOpenWishlist(false)}
          />
        </div>

        {/* Items */}
        {wishlist && wishlist.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-5">
            <span className="text-[40px] mb-3">💚</span>
            <h4 className="text-[16px] font-[500] text-[#131921]">Your wishlist is empty</h4>
            <p className="text-[13px] text-[#555] mt-1">Save items you love</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {wishlist.map((item, index) => (
              <div key={index} className="px-4 py-3 border-b border-[#f0f0f0] hover:bg-[#fafafa] transition">
                <div className="flex gap-3">
                  {/* Image */}
                  <Link to={`/product/${item._id}`} onClick={() => setOpenWishlist(false)}>
                    <img
                      src={getImageUrl(item?.images?.[0])}
                      className="w-[70px] h-[70px] object-contain rounded border border-[#e7e7e7] p-1"
                      alt={item.name}
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] text-[#0f1111] leading-tight line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    <p className="text-[15px] font-[600] text-[#131921]">
                      ₹{item.discountPrice?.toLocaleString()}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => addToCartHandler(item)}
                        className="flex items-center gap-1 text-[11px] text-[#0066c0] hover:text-[#c45500] hover:underline"
                      >
                        <BsCartPlus size={14} />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlistHandler(item)}
                        className="text-[11px] text-[#0066c0] hover:text-[#c45500] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
