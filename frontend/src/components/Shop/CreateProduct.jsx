import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product created successfully!");
      navigate("/dashboard");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleImageChange = (e) => {
    e.preventDefault();
    let files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newForm = new FormData();
    images.forEach((image) => {
      newForm.append("images", image);
    });
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);
    newForm.append("shopId", seller._id);
    dispatch(createProduct(newForm));
  };

  return (
    <div className="w-[90%] 800px:w-[70%] max-w-[900px] bg-white rounded-lg shadow-sm border border-[#ddd] mx-auto my-4">
      {/* Header */}
      <div className="bg-[#131921] rounded-t-lg px-6 py-4">
        <h1 className="text-[20px] font-[600] text-white">Add a Product</h1>
        <p className="text-[13px] text-gray-300 mt-1">
          Fill in the product details to list it on the marketplace
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* Product Identity Section */}
        <div className="border border-[#e7e7e7] rounded-lg p-5 mb-5">
          <h2 className="text-[16px] font-[600] text-[#131921] mb-4 pb-2 border-b border-[#e7e7e7]">
            Product Identity
          </h2>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
              Product Name <span className="text-[#c45500]">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[35px] px-[10px] border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
              placeholder="Enter product name (e.g., iPhone 14 Pro 128GB)"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
              Description <span className="text-[#c45500]">*</span>
            </label>
            <textarea
              rows="5"
              required
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-[10px] py-[8px] border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)] resize-none"
              placeholder="Describe your product in detail — features, specifications, condition..."
            ></textarea>
          </div>

          {/* Category & Tags Row */}
          <div className="grid grid-cols-1 800px:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
                Category <span className="text-[#c45500]">*</span>
              </label>
              <select
                className="w-full h-[35px] px-[7px] border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none bg-white focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Choose a category</option>
                {categoriesData &&
                  categoriesData.map((i) => (
                    <option value={i.title} key={i.title}>
                      {i.title}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
                Tags <span className="text-[#555] font-[400]">(optional)</span>
              </label>
              <input
                type="text"
                name="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full h-[35px] px-[10px] border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
                placeholder="e.g., electronics, mobile, refurbished"
              />
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="border border-[#e7e7e7] rounded-lg p-5 mb-5">
          <h2 className="text-[16px] font-[600] text-[#131921] mb-4 pb-2 border-b border-[#e7e7e7]">
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 800px:grid-cols-3 gap-4">
            <div>
              <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
                Original Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full h-[35px] px-[10px] border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
                placeholder="MRP"
              />
            </div>
            <div>
              <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
                Selling Price (₹) <span className="text-[#c45500]">*</span>
              </label>
              <input
                type="number"
                name="discountPrice"
                required
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full h-[35px] px-[10px] border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
                placeholder="Your price"
              />
            </div>
            <div>
              <label className="block text-[13px] font-[700] text-[#111] mb-[4px]">
                Stock <span className="text-[#c45500]">*</span>
              </label>
              <input
                type="number"
                name="stock"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full h-[35px] px-[10px] border border-[#a6a6a6] rounded-[4px] text-[13px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,185,106)]"
                placeholder="Quantity available"
              />
            </div>
          </div>

          {/* Discount Preview */}
          {originalPrice && discountPrice && Number(originalPrice) > Number(discountPrice) && (
            <div className="mt-3 bg-[#f0faf0] border border-[#c3e6cb] rounded-[4px] px-3 py-2">
              <span className="text-[12px] text-[#155724] font-[600]">
                💰 Discount: {Math.round((1 - Number(discountPrice) / Number(originalPrice)) * 100)}% off
                (Saves ₹{(Number(originalPrice) - Number(discountPrice)).toLocaleString()})
              </span>
            </div>
          )}
        </div>

        {/* Images Section */}
        <div className="border border-[#e7e7e7] rounded-lg p-5 mb-5">
          <h2 className="text-[16px] font-[600] text-[#131921] mb-4 pb-2 border-b border-[#e7e7e7]">
            Product Images <span className="text-[#c45500]">*</span>
          </h2>
          <p className="text-[12px] text-[#555] mb-3">
            Upload clear images of your product. First image will be the main listing photo.
          </p>

          <div className="flex items-center flex-wrap gap-3">
            {/* Upload Button */}
            <label
              htmlFor="upload"
              className="w-[100px] h-[100px] border-2 border-dashed border-[#adb1b8] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#e77600] hover:bg-[#fef8f0] transition"
            >
              <AiOutlinePlusCircle size={24} className="text-[#555] mb-1" />
              <span className="text-[11px] text-[#555]">Add image</span>
            </label>
            <input
              type="file"
              id="upload"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* Image Previews */}
            {images.map((img, index) => (
              <div key={index} className="relative w-[100px] h-[100px] rounded-lg border border-[#ddd] overflow-hidden group">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-[#131921] bg-opacity-80 text-white text-[9px] text-center py-[2px]">
                    MAIN
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition"
                >
                  <AiOutlineClose size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Section */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="h-[40px] px-8 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-[4px] text-[14px] font-[600] text-[#111] cursor-pointer hover:from-[#f5d78e] hover:to-[#eeb933] active:shadow-[0_0_3px_2px_rgb(228,185,106)]"
          >
            Submit Listing
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="h-[40px] px-6 bg-gradient-to-b from-[#f7f8fa] to-[#e7e9ec] border border-[#adb1b8] rounded-[4px] text-[13px] text-[#111] cursor-pointer hover:from-[#e7eaf0] hover:to-[#d9dce1]"
          >
            Cancel
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-5 bg-[#f0f8ff] border border-[#b8daff] rounded-[4px] p-4">
          <p className="text-[12px] text-[#004085] leading-[1.6]">
            <span className="font-[700]">ℹ Seller Tip:</span> Products with clear images and detailed
            descriptions sell 40% faster. Include at least 3 photos showing different angles.
            Refurbished items should mention condition details for trust.
          </p>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
