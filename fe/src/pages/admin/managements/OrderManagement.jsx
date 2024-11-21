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
      },
    }
  }

  useEffect(() => {
    if ((!allOrder || !allOrder.length) && !tryToFetchOrder) {
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

  const fields = {
    id: {
      type: [admin_table_field_types.NO_FORM_DATA],
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

          const combinedResults = firstNameQuery.filter(
            (item) => !lastNameQuery.some((element) => element.value === item.value)
          ).concat(lastNameQuery);
          console.log("combinedResults", combinedResults);
          return combinedResults;
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
    await putDataAPI(`admin/order/${id}`, put).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setAllOrder(allOrder.map((item) => {
        if (parseInt(item.id.value) === parseInt(id)) {
          return mapData(res.data.order);
        }
        return item;
      }));
    }).catch(err => {
      console.log(err)
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
    });
  }

  const handleAddNewRow = async (post) => {
    await postDataAPI(`admin/order`, post).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setAllOrder([...allOrder, mapData(res.data.order)]);
      return true;
    }).catch(err => {
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
      return false;
    });
  }

  const handleDeleteRow = async (id) => {
    await deleteDataAPI(`admin/order/${id}`).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setAllOrder(allOrder.filter((item) => parseInt(item.id) !== parseInt(id)));
      return true;
    }
    ).catch(err => {
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
      return false;
    });
  }
  return (
    <div>
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