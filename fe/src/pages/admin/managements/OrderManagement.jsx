import React, { useEffect, useState } from 'react';
import AdminTable from './AdminManagementTable';
import { admin_table_field_types, order_status } from '../../../constants/constants';
import { deleteDataAPI, getDataAPI, postDataAPI, putDataAPI } from '../../../utils/fetchData';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [allOrder, setAllOrder] = useState([]);
  const [pendingOrder, setPendingOrder] = useState([]);
  const [tryToFetchOrder, setTryToFetchOrder] = useState(false);

  const mapData = (item) => {
    return {
      id: {
        value: item.id
      }, user_id: {
        value: item.user?.id,
        user: item.user
      },
      status: {
        value: item.status
      },
      total_amount: {
        value: item.total_amount
      },
      currency: {
        value: item.currency
      },
      discount: {
        value: item.discount
      },
      info: {
        value: item.info
      },
      payment_method: {
        value: item.payment_method
      },
      payment_bank_code: {
        value: item.payment_bank_code
      }
    }
  }

  useEffect(() => {
    if ((!allOrder || !allOrder.length)) {
      getDataAPI("admin/order").then(res => {
        setTimeout(() => {
          setAllOrder(res?.data?.orders.map((item) => mapData(item)) || []);
        }, 500);
      }).catch(err => {
        console.log(err)
        dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: "Lỗi khi tải danh sách order" });
      });
      setTryToFetchOrder(true);
    }
  }, [allOrder, dispatch, navigate, tryToFetchOrder]);

  useEffect(() => {
    setPendingOrder(allOrder?.filter((item) => item.status.value === order_status.PENDING));
  }, [allOrder]);

  const fields = {
    id: {
      type: [admin_table_field_types.NO_FORM_DATA, admin_table_field_types.ID],
      value: ""
    }, user_id: {
      type: [
        admin_table_field_types.QUERY,
      ],
      query_function: async (query) => {
        try {
          // Chạy cả hai truy vấn song song với Promise.all
          const [firstNameQuery, lastNameQuery] = await Promise.all([
            getDataAPI(`admin/user/query?first_name=${query}`).then(res =>
              res.data.users.map((item) => ({
                value: item.id,
                label: `${item.first_name} ${item.last_name}`
              }))
            ),
            getDataAPI(`admin/user/query?last_name=${query}`).then(res =>
              res.data.users.map((item) => ({
                value: item.id,
                label: `${item.first_name} ${item.last_name}`
              }))
            )
          ]);

          let combinedResults = firstNameQuery.filter(
            (item) => !lastNameQuery.some((element) => element.value === item.value)
          ).concat(lastNameQuery);
          combinedResults = combinedResults.concat({
            value: null,
            label: "None"
          });
          return combinedResults
        } catch (error) {
          console.error("Error fetching user data:", error);
          throw new Error("Unable to fetch user data.");
        }
      },
      get_function: async (id) => {
        return await getDataAPI(`admin/user/${id}`).then(res => {
          return res.data.user.first_name + " " + res.data.user.last_name;
        });
      },
      value: ""
    },
    status: {
      type: [admin_table_field_types.SELECT, admin_table_field_types.REQUIRED],
      value: "",
      options: Object.keys(order_status).map((key) => {
        return {
          value: order_status[key],
          label: order_status[key]
        }
      })
    },
    total_amount: {
      type: [admin_table_field_types.NUMBER],
      value: ""
    },
    currency: {
      type: [admin_table_field_types.TEXT, admin_table_field_types.NO_SHOW_DATA],
      value: ""
    },
    discount: {
      type: [admin_table_field_types.NUMBER],
      value: "",
    },
    info: {
      type: [admin_table_field_types.JSON],
      value: ""
    },
    payment_method: {
      type: [admin_table_field_types.TEXT, admin_table_field_types.NO_EDITABLE],
      value: ""
    },
    payment_bank_code: {
      type: [admin_table_field_types.TEXT, admin_table_field_types.NO_EDITABLE],
      value: ""
    },
  };

  const handleUpdateRow = async (id, put) => {
    console.log(put)
    await putDataAPI(`admin/order/${id}`, put).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setAllOrder([]);
    }).catch(err => {
      console.log(err)
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
    });
  }

  const handleAddNewRow = async (post) => {
    await postDataAPI(`admin/order`, post).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setAllOrder([]);
      return true;
    }).catch(err => {
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
      return false;
    });
  }

  const handleDeleteRow = async (id) => {
    await deleteDataAPI(`admin/order/${id}`).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setAllOrder([]);
      return true;
    }
    ).catch(err => {
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
      return false;
    });
  }
  return (
    <div>
      <div className="mb-4">
        <AdminTable
          title={"Pending Order Management"}
          fields={fields}
          input_data={pendingOrder}
          handleUpdateRow={handleUpdateRow}
          handleAddNewRow={handleAddNewRow}
          handleDeleteRow={handleDeleteRow}
          table_key='2'
        />
      </div>
      <AdminTable
        title={"All Order Management"}
        fields={fields}
        input_data={allOrder}
        handleUpdateRow={handleUpdateRow}
        handleAddNewRow={handleAddNewRow}
        handleDeleteRow={handleDeleteRow}
      />
    </div >
  );
}

export default OrderManagement;