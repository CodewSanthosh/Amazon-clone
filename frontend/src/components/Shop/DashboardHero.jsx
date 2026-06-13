import React, { useEffect } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller]);

  const availableBalance = seller?.availableBalance?.toFixed(2) || "0.00";
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;
  const deliveredOrders = orders?.filter((o) => o.status === "Delivered").length || 0;
  const pendingOrders = orders?.filter((o) => o.status === "Processing").length || 0;

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={18} />
            </Button>
          </Link>
        );
      },
    },
  ];

  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: "₹" + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="w-full p-6 bg-[#f6f6f6] min-h-[calc(100vh-56px)]">
      {/* Welcome Bar */}
      <div className="bg-white rounded-lg border border-[#e7e7e7] p-5 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-[600] text-[#131921]">
              Welcome back, {seller?.name} 👋
            </h2>
            <p className="text-[13px] text-[#555] mt-1">
              Here's what's happening with your store today.
            </p>
          </div>
          <Link
            to="/dashboard-create-product"
            className="h-[36px] px-5 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-[4px] text-[13px] font-[500] text-[#111] flex items-center gap-2 hover:from-[#f5d78e] hover:to-[#eeb933] transition"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 800px:grid-cols-4 gap-4 mb-5">
        {/* Revenue */}
        <div className="bg-white rounded-lg border border-[#e7e7e7] p-5 hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-[500] text-[#555] uppercase tracking-wide">
              Revenue
            </span>
            <span className="w-[32px] h-[32px] bg-[#fff3e0] rounded-full flex items-center justify-center text-[16px]">
              💰
            </span>
          </div>
          <h3 className="text-[24px] font-[700] text-[#131921]">₹{availableBalance}</h3>
          <Link
            to="/dashboard-withdraw-money"
            className="text-[12px] text-[#0066c0] hover:text-[#c45500] hover:underline mt-2 inline-block"
          >
            Withdraw →
          </Link>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg border border-[#e7e7e7] p-5 hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-[500] text-[#555] uppercase tracking-wide">
              Total Orders
            </span>
            <span className="w-[32px] h-[32px] bg-[#e3f2fd] rounded-full flex items-center justify-center text-[16px]">
              📋
            </span>
          </div>
          <h3 className="text-[24px] font-[700] text-[#131921]">{totalOrders}</h3>
          <Link
            to="/dashboard-orders"
            className="text-[12px] text-[#0066c0] hover:text-[#c45500] hover:underline mt-2 inline-block"
          >
            View all →
          </Link>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg border border-[#e7e7e7] p-5 hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-[500] text-[#555] uppercase tracking-wide">
              Products
            </span>
            <span className="w-[32px] h-[32px] bg-[#e8f5e9] rounded-full flex items-center justify-center text-[16px]">
              📦
            </span>
          </div>
          <h3 className="text-[24px] font-[700] text-[#131921]">{totalProducts}</h3>
          <Link
            to="/dashboard-products"
            className="text-[12px] text-[#0066c0] hover:text-[#c45500] hover:underline mt-2 inline-block"
          >
            Manage →
          </Link>
        </div>

        {/* Delivery Stats */}
        <div className="bg-white rounded-lg border border-[#e7e7e7] p-5 hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-[500] text-[#555] uppercase tracking-wide">
              Fulfillment
            </span>
            <span className="w-[32px] h-[32px] bg-[#fce4ec] rounded-full flex items-center justify-center text-[16px]">
              🚚
            </span>
          </div>
          <h3 className="text-[24px] font-[700] text-[#131921]">{deliveredOrders}</h3>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[11px] text-[#4caf50] font-[500]">
              ✓ {deliveredOrders} delivered
            </span>
            <span className="text-[11px] text-[#ff9800] font-[500]">
              ⏳ {pendingOrders} pending
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 800px:grid-cols-4 gap-3 mb-5">
        <Link
          to="/dashboard-create-product"
          className="bg-white border border-[#e7e7e7] rounded-lg p-4 flex items-center gap-3 hover:border-[#ff9900] hover:shadow-sm transition"
        >
          <span className="text-[20px]">📝</span>
          <span className="text-[12px] font-[500] text-[#131921]">New Product</span>
        </Link>
        <Link
          to="/dashboard-create-event"
          className="bg-white border border-[#e7e7e7] rounded-lg p-4 flex items-center gap-3 hover:border-[#ff9900] hover:shadow-sm transition"
        >
          <span className="text-[20px]">🎉</span>
          <span className="text-[12px] font-[500] text-[#131921]">Create Event</span>
        </Link>
        <Link
          to="/dashboard-coupouns"
          className="bg-white border border-[#e7e7e7] rounded-lg p-4 flex items-center gap-3 hover:border-[#ff9900] hover:shadow-sm transition"
        >
          <span className="text-[20px]">🏷️</span>
          <span className="text-[12px] font-[500] text-[#131921]">Coupons</span>
        </Link>
        <Link
          to="/dashboard-messages"
          className="bg-white border border-[#e7e7e7] rounded-lg p-4 flex items-center gap-3 hover:border-[#ff9900] hover:shadow-sm transition"
        >
          <span className="text-[20px]">💬</span>
          <span className="text-[12px] font-[500] text-[#131921]">Messages</span>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg border border-[#e7e7e7] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e7e7e7]">
          <h3 className="text-[16px] font-[600] text-[#131921]">Recent Orders</h3>
          <Link
            to="/dashboard-orders"
            className="text-[12px] text-[#0066c0] hover:text-[#c45500] hover:underline font-[500]"
          >
            View all orders →
          </Link>
        </div>
        <div className="min-h-[300px]">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      </div>

      {/* Second Life Info Box */}
      <div className="mt-5 bg-gradient-to-r from-[#e8f5e9] to-[#e3f2fd] border border-[#c8e6c9] rounded-lg p-5">
        <div className="flex items-start gap-3">
          <span className="text-[24px]">♻️</span>
          <div>
            <h4 className="text-[14px] font-[600] text-[#131921]">
              Amazon Second Life Program
            </h4>
            <p className="text-[12px] text-[#555] mt-1 leading-relaxed">
              Returned products from your store are AI-graded and given a second life —
              resold as certified refurbished, donated, or recycled. You earn revenue
              recovery and customers earn Green Credits. Everyone wins.
            </p>
            <Link
              to="/dashboard-refunds"
              className="text-[12px] text-[#0066c0] hover:text-[#c45500] hover:underline font-[500] mt-2 inline-block"
            >
              View returns & refunds →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
