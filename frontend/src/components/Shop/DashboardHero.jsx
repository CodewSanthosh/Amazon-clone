import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import { server } from "../../server";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
      dispatch(getAllProductsShop(seller._id));
      fetchReturnAnalytics();
    }
  }, [dispatch, seller]);

  const [returnAnalytics, setReturnAnalytics] = useState(null);

  const fetchReturnAnalytics = async () => {
    try {
      const res = await axios.get(`${server}/seller-analytics/dashboard/${seller?._id}`);
      if (res.data.success) setReturnAnalytics(res.data.analytics);
    } catch (err) {}
  };

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

      {/* Return Analytics Panel */}
      <div className="mt-5 bg-white border border-[#e7e7e7] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e7e7e7] bg-gradient-to-r from-[#e8f5e9] to-[#e3f2fd]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[20px]">♻️</span>
              <h3 className="text-[16px] font-[600] text-[#131921]">Second Life Returns & Analytics</h3>
            </div>
            <Link
              to="/dashboard-refunds"
              className="text-[12px] text-[#0066c0] hover:text-[#c45500] hover:underline font-[500]"
            >
              View all returns →
            </Link>
          </div>
        </div>

        {returnAnalytics ? (
          <div className="p-5">
            {/* Return Stats Grid */}
            <div className="grid grid-cols-2 800px:grid-cols-4 gap-4 mb-5">
              <div className="text-center p-3 bg-[#f7f7f7] rounded-lg">
                <p className="text-[22px] font-[700] text-[#131921]">{returnAnalytics.totalReturns}</p>
                <p className="text-[11px] text-[#555]">Total Returns</p>
              </div>
              <div className="text-center p-3 bg-[#f7f7f7] rounded-lg">
                <p className="text-[22px] font-[700] text-[#00a86b]">{returnAnalytics.listedAsRefurbished}</p>
                <p className="text-[11px] text-[#555]">Listed Refurbished</p>
              </div>
              <div className="text-center p-3 bg-[#f7f7f7] rounded-lg">
                <p className="text-[22px] font-[700] text-[#ff9900]">{returnAnalytics.soldRefurbished}</p>
                <p className="text-[11px] text-[#555]">Sold (Recovered)</p>
              </div>
              <div className="text-center p-3 bg-[#f7f7f7] rounded-lg">
                <p className="text-[22px] font-[700] text-[#131921]">{returnAnalytics.avgCondition}/10</p>
                <p className="text-[11px] text-[#555]">Avg Condition</p>
              </div>
            </div>

            {/* Revenue Split */}
            <div className="grid grid-cols-1 800px:grid-cols-2 gap-4 mb-4">
              <div className="border border-[#c8e6c9] bg-[#f0faf0] rounded-lg p-4">
                <p className="text-[11px] text-[#555] font-[500] uppercase mb-1">Your Recovery (85%)</p>
                <p className="text-[20px] font-[700] text-[#2e7d32]">₹{returnAnalytics.sellerRecovery?.toLocaleString()}</p>
                <p className="text-[11px] text-[#555] mt-1">Revenue recovered from refurbished sales</p>
              </div>
              <div className="border border-[#e3f2fd] bg-[#f0f8ff] rounded-lg p-4">
                <p className="text-[11px] text-[#555] font-[500] uppercase mb-1">Amazon Service Fee (15%)</p>
                <p className="text-[20px] font-[700] text-[#1565c0]">₹{returnAnalytics.amazonServiceFee?.toLocaleString()}</p>
                <p className="text-[11px] text-[#555] mt-1">AI grading + listing + logistics</p>
              </div>
            </div>

            {/* Top Return Reasons */}
            {returnAnalytics.topReasons && returnAnalytics.topReasons.length > 0 && (
              <div>
                <p className="text-[12px] font-[600] text-[#131921] mb-2">Top Return Reasons:</p>
                <div className="flex flex-wrap gap-2">
                  {returnAnalytics.topReasons.map((r, i) => (
                    <span key={i} className="text-[11px] bg-[#fff3e0] text-[#e65100] px-2 py-1 rounded">
                      {r.reason} ({r.count})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Insights button */}
            <div className="mt-4 pt-4 border-t border-[#e7e7e7]">
              <p className="text-[12px] text-[#555] mb-2">
                💡 <span className="font-[500]">How it works:</span> When a product is returned, AI grades it and notifies nearby interested users.
                The product ships directly to them — skipping the warehouse — saving you transport costs.
                You get 85% of the resale price, Amazon takes 15% for AI + logistics.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 text-center">
            <p className="text-[13px] text-[#555]">No return data yet. Returns will show analytics here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHero;
