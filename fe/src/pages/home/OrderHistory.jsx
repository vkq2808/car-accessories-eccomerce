import React, { useEffect, useState } from 'react';
import { getDataAPI, putDataAPI } from '../../utils/fetchData';
import { formatNumberWithCommas } from '../../utils/stringUtils';
import { order_status, payment_method_codes } from '../../constants/constants';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
const OrderHistory = () => {
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);

  useEffect(() => {
    getDataAPI('user/orders').then(res => {
      setDisplayedOrders(res.data.orders.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    }).catch(err => {
      console.log(err);
    });
  }, []);

  const handleViewOrder = (order) => {
    setViewOrder(order);
  }

  return (
    <div className="w-full bg-[--primary-background-color] text-[--primary-text-color] shadow-lg shadow-[--tertiary-text-color h-[70vh] overflow-y-auto scrollbar-hide p-4">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-lg font-semibold">Order History</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-center p-2">Order ID</th>
              <th className="text-center p-2">Ngày cập nhật</th>
              <th className="text-center p-2">Tổng tiền</th>
              <th className="text-center p-2">Trạng thái</th>
              <th className="text-center p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {
              displayedOrders.map(order => (
                <tr key={order.id}>
                  <td className="text-center p-2">{order.id}</td>
                  <td className="text-center p-2">{new Date(order.createdAt).toLocaleString('vi-VN')}</td>
                  <td className="text-center p-2">{formatNumberWithCommas(order.total_amount)} {order.currency}</td>
                  <td className="text-center p-2">{order.status}</td>
                  <td className="text-center p-2">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="bg-[--tertiary-background-color] text-[--tertiary-text-color] p-2 rounded-md">
                      View
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      {viewOrder && <ViewOrderDetail order={viewOrder} setViewOrder={setViewOrder} setDisplayedOrders={setDisplayedOrders} />}
    </div>
  )
}

const ViewOrderDetail = ({ order, setViewOrder, setDisplayedOrders }) => {
  const dispatch = useDispatch();

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      putDataAPI(`user/order/${order.id}/cancel`).then(res => {
        dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
        setDisplayedOrders(prevOrders => prevOrders.map(prevOrder => prevOrder.id === order.id ? res.data.order : prevOrder));
        setViewOrder(null);
      }).catch(err => {
        console.log(err);
        dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
      });
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"        >
      <div className="bg-[--primary-background-color] rounded-lg px-6 pb-4 w-full max-w-2xl max-h-[60vh] overflow-y-scroll scrollbar-hide">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-lg font-semibold">Order Detail</h1>
          <button
            onClick={() => setViewOrder(null)}
            className="bg-[--tertiary-background-color] text-[--tertiary-text-color] p-2 rounded-md"
          >
            Close
          </button>
        </div>
        <div className='flex gap-10'>
          <div className='w-1/2'>
            <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
            <h4 className="text-md font-semibold">Date: {new Date(order.createdAt).toLocaleString('vi-VN')}</h4>
            <h4 className="text-md font-semibold">Total: {formatNumberWithCommas(order.total_amount)} {order.currency}</h4>
            <h4 className="text-md font-semibold">Status: {order.status}</h4>
            <h4 className="text-md font-semibold">Payment Method: {order.payment_method}</h4>
          </div>
          <div className='w-1/2 flex justify-center items-center'>
            {order.status === order_status.PENDING &&
              order.payment_method &&
              order.payment_method === payment_method_codes.COD &&
              <button
                onClick={handleCancelOrder}
                className='p-3 bg-red-500 hover:bg-red-700 rounded-lg text-white'
              >
                Cancel Order
              </button>}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="border p-2">Product</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {
                order.order_items.map(item => (
                  <tr key={item.id}>
                    <td className="border p-2">{item.product.name}</td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2">{formatNumberWithCommas(item.price)} {order.currency}</td>
                    <td className="border p-2">{formatNumberWithCommas(item.price * item.quantity)} {order.currency}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrderHistory;