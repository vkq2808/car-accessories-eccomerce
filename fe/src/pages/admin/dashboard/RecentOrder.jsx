import { useEffect, useState } from "react";
import { admin_table_field_types } from "../../../constants/constants";
import AdminTable from "../managements/AdminManagementTable";
import { getDataAPI } from "../../../utils/fetchData";

const RecentOrderTable = () => {

  const [data, setData] = useState([]);

  const fields = {
    id: {
      type: [admin_table_field_types.NUMBER],
    },
    total_amount: {
      type: [admin_table_field_types.NUMBER],
    },
    payment_method: {
      type: [admin_table_field_types.TEXT],
    },
    status: {
      type: [admin_table_field_types.TEXT],
    },
  }

  useEffect(() => {
    const fetchOrders = async () => {
      let res = await getDataAPI('admin/order');
      let data = res.data.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5).map((item) => {
        return {
          id: {
            value: item.id,
          },
          total_amount: {
            value: item.total_amount,
          },
          payment_method: {
            value: item.payment_method,
          },
          status: {
            value: item.status,
          },
        }
      });
      setData(data);
    }
    fetchOrders();
  }, []);

  return (
    <AdminTable
      fields={fields}
      input_data={data}
      actable={false}
    />
  )
}

export default RecentOrderTable;