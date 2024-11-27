import React, { useEffect, useState } from 'react';
import AdminTable from './AdminManagementTable';
import { admin_table_field_types, cost_types } from '../../../constants/constants';
import { deleteDataAPI, getDataAPI, postDataAPI, putDataAPI } from '../../../utils/fetchData';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { useNavigate } from 'react-router-dom';

const CostManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [allCost, setAllCost] = useState([]);
  const [tryToFetchCost, setTryToFetchCost] = useState(false);

  const mapData = (item) => {
    return {
      id: {
        value: item.id
      },
      total_cost: {
        value: item.total_cost
      },
      decription: {
        value: item.decription
      },
      cost_type: {
        value: item.cost_type
      }, employee_id: {
        value: item.employee?.id,
        employee: item.employee,
      },
      product_id: {
        value: item.product?.id,
        product: item.product,
      }
    };
  }

  useEffect(() => {
    if ((!allCost || !allCost.length) && !tryToFetchCost) {
      getDataAPI("admin/cost").then(res => {
        setTimeout(() => {
          setAllCost(res?.data?.costs?.map((item) => mapData(item)) || []);
        }, 500);
      }).catch(err => {
        dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: "Lỗi khi tải danh sách chi phí" });
      });
      setTryToFetchCost(true);
    }
  }, [allCost, dispatch, navigate, tryToFetchCost]);

  const fields = {
    id: {
      type: [admin_table_field_types.NO_FORM_DATA, admin_table_field_types.ID],
      value: ""
    },
    total_cost: {
      type: [admin_table_field_types.NUMBER, admin_table_field_types.REQUIRED],
      value: ""
    },
    decription: {
      type: [admin_table_field_types.TEXT],
      value: ""
    },
    cost_type: {
      type: [admin_table_field_types.SELECT, admin_table_field_types.REQUIRED],
      value: cost_types.PURCHASE,
      options: Object.keys(cost_types).map((key) => ({
        value: key,
        label: key
      })),
    }, employee_id: {
      type: [
        admin_table_field_types.QUERY,
        admin_table_field_types.CHILD_SELECT,
        admin_table_field_types.NO_SHOW_DATA
      ],
      query_function: async (query) => {
        try {
          // Chạy cả hai truy vấn song song với Promise.all
          const [firstNameQuery, lastNameQuery] = await Promise.all([
            getDataAPI(`admin/user/query?role=EMPLOYEE&first_name=${query}`).then(res =>
              res.data.users.map((item) => ({
                value: item.id,
                label: `${item.first_name} ${item.last_name}`
              }))
            ),
            getDataAPI(`admin/user/query?role=EMPLOYEE&last_name=${query}`).then(res =>
              res.data.users.map((item) => ({
                value: item.id,
                label: `${item.first_name} ${item.last_name}`
              }))
            )
          ]);

          const combinedResults = firstNameQuery.filter(
            (item) => !lastNameQuery.some((element) => element.value === item.value)
          ).concat(lastNameQuery);
          return combinedResults;
        } catch (error) {
          console.error("Error fetching user data:", error);
          dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: "Unable to fetch user data." });
        }
      },
      get_function: async (id) => {
        return await getDataAPI(`admin/user/${id}`).then(res => {
          return res.data.user.first_name + " " + res.data.user.last_name;
        });
      },
      child_key: cost_types.SALARY,
      parent_key: "cost_type",
      value: ""
    },
    product_id: {
      type: [admin_table_field_types.QUERY, admin_table_field_types.CHILD_SELECT, admin_table_field_types.NO_SHOW_DATA],
      query_function: async (query) => {
        try {
          return await getDataAPI(`admin/product/query?path=${query}`).then(res => {
            return res.data.products.map((item) => ({
              value: item.id,
              label: item.name
            }))
          }
          );
        } catch (error) {
          console.error("Error fetching product data:", error);
          dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: "Unable to fetch product data." });
        }
      },
      get_function: async (id) => {
        return await getDataAPI(`admin/product/${id}`).then(res => {
          return res.data.product.name;
        });
      },
      child_key: cost_types.PURCHASE,
      parent_key: "cost_type",
      value: ""
    }
  };

  const handleUpdateRow = async (id, put) => {
    await putDataAPI(`admin/cost/${id}`, put).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setAllCost(allCost.map((item) => {
        if (parseInt(item.id.value) === parseInt(id)) {
          return mapData(res.data.cost);
        }
        return item;
      }));
    }).catch(err => {
      console.log(err)
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
    });
  }

  const handleAddNewRow = async (post) => {
    await postDataAPI(`admin/cost`, post).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setAllCost([...allCost, mapData(res.data.cost)]);
      return true;
    }).catch(err => {
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
      return false;
    });
  }

  const handleDeleteRow = async (id) => {
    await deleteDataAPI(`admin/cost/${id}`).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setAllCost(allCost.filter((item) => parseInt(item.id.value) !== parseInt(id)));
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
        title={"All Cost Management"}
        fields={fields}
        input_data={allCost}
        handleUpdateRow={handleUpdateRow}
        handleAddNewRow={handleAddNewRow}
        handleDeleteRow={handleDeleteRow}
      />
    </div >
  );
}

export default CostManagement;