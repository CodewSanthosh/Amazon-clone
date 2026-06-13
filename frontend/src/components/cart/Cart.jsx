import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageUrl";
import { addTocart, removeFromCart } from "../../redux/actions/cart";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[#00000066] z-[100]">
      {/* Overlay click to close */}
      <div className="absolute w-full h-full" onClick={() => setOpenCart(false)}></div>

      {/* Cart Panel */}
      <div className="fixed top-0 right-0 h-full w-[90%] 800px:w-[380px] bg-white flex flex-col z-[101] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e7e7e7] bg-[#f7f7f7]">
          <div className="flex items-center gap-2">
            <IoBagHandleOutline size={22} color="#131921" />
            <h3 className="text-[16px] font-[600] text-[#131921]">
              Shopping Cart ({cart?.length || 0})
            </h3>
          </div>
          <RxCross1
            size={20}
            className="cursor-pointer text-[#555] hover:text-[#131921] transition"
            onClick={() => setOpenCart(false)}
          />
        </div>

        {/* Cart Items */}
        {cart && cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-5">
            <span className="text-[40px] mb-3">🛒</span>
            <h4 className="text-[16px] font-[500] text-[#131921]">Your cart is empty</h4>
            <p className="text-[13px] text-[#555] mt-1">Add items to get started</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {cart.map((item, index) => (
                <CartSingle
                  data={item}
                  key={index}
                  quantityChangeHandler={quantityChangeHandler}
                  removeFromCartHandler={removeFromCartHandler}
                />
              ))}
            </div>

            {/* Footer - Total & Checkout */}
            <div className="border-t border-[#e7e7e7] bg-white px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] text-[#555]">Subtotal:</span>
                <span className="text-[18px] font-[700] text-[#131921]">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
              <Link to="/checkout" onClick={() => setOpenCart(false)}>
                <button className="w-full h-[42px] bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-[4px] text-[14px] font-[500] text-[#131921] hover:from-[#f5d78e] hover:to-[#eeb933] transition">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const increment = (data) => {
    if (data.stock < value) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      const updateCartData = { ...data, qty: value + 1 };
      quantityChangeHandler(updateCartData);
    }
  };

  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="px-4 py-3 border-b border-[#f0f0f0] hover:bg-[#fafafa] transition">
      <div className="flex gap-3">
        {/* Image */}
        <Link to={`/product/${data._id}`}>
          <img
            src={getImageUrl(data?.images?.[0])}
            className="w-[70px] h-[70px] object-contain rounded border border-[#e7e7e7] p-1"
            alt={data.name}
          />
        </Link>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] text-[#0f1111] leading-tight line-clamp-2 mb-1">
            {data.name}
          </h4>
          <p className="text-[15px] font-[600] text-[#131921]">
            ₹{totalPrice.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#007600]">In Stock</p>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center border border-[#ddd] rounded-md overflow-hidden">
              <button
                onClick={() => decrement(data)}
                className="w-[28px] h-[26px] flex items-center justify-center bg-[#f7f7f7] hover:bg-[#e7e7e7] transition text-[#555]"
              >
                <HiOutlineMinus size={12} />
              </button>
              <span className="w-[30px] h-[26px] flex items-center justify-center text-[12px] font-[500] bg-white border-x border-[#ddd]">
                {value}
              </span>
              <button
                onClick={() => increment(data)}
                className="w-[28px] h-[26px] flex items-center justify-center bg-[#f7f7f7] hover:bg-[#e7e7e7] transition text-[#555]"
              >
                <HiPlus size={12} />
              </button>
            </div>
            <button
              onClick={() => removeFromCartHandler(data)}
              className="text-[11px] text-[#0066c0] hover:text-[#c45500] hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
