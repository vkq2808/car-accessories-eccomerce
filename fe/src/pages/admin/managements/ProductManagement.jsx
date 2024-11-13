import React, { useEffect, useState } from 'react';
import AdminTable from './AdminManagementTable';
import { admin_table_field_types } from '../../../constants/constants';
import { deleteDataAPI, getDataAPI, postDataAPI, putDataAPI } from '../../../utils/fetchData';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const mapData = (item) => {
    return {
      id: {
        value: item.id
      },
      name: {
        value: item.name
      },
      detail: {
        value: item.detail
      },
      stock: {
        value: item.stock
      },
      price: {
        value: item.price
      },
      currency: {
        value: item.currency
      },
      category_id: {
        value: item.category_id,
      }
    }
  }

  useEffect(() => {
    if (!data || !data.length) {
      getDataAPI('admin/category').then(cate_res => {
        setCategoryData(cate_res.data.map((item) => {
          return {
            id: item.id,
            display: item.name
          }
        }));
        getDataAPI('admin/product').then(res => {
          console.log(res.data)
          setData(res.data.map((item) => {
            return mapData(item);
          }));
        }).catch(err => {
          if (err.response?.status === 403) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: { error: err.response.data.message } });
            // navigate('/auth/login');
          }
        });
      }).catch(err => {
        console.log(err)
      });
    }
  }, [data, dispatch, navigate]);

  const fields = {
    id: {
      type: [admin_table_field_types.NO_FORM_DATA],
      value: ""
    },
    name: {
      type: [admin_table_field_types.TEXT],
      value: ""
    },
    detail: {
      type: [admin_table_field_types.TEXTAREA, admin_table_field_types.NO_SHOW_DATA],
      value: ""
    },
    stock: {
      type: [admin_table_field_types.NUMBER],
      value: ""
    },
    price: {
      type: [admin_table_field_types.NUMBER],
      value: ""
    },
    currency: {
      type: [admin_table_field_types.TEXT],
      value: ""
    },
    category_id: {
      type: [admin_table_field_types.SELECT, admin_table_field_types.NUMBER],
      value: "",
      options: categoryData
    }
  };

  const handleUpdateRow = async (id, put) => {
    console.log(put)
    await putDataAPI(`admin/product/${id}`, put).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setData(data.map((item) => {
        if (parseInt(item.id.value) === parseInt(id)) {
          return mapData(res.data.product);
        }
        return item;
      }));
    }).catch(err => {
      console.log(err)
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: { error: err.response.data.message } });
    });
  }

  const handleAddNewRow = async (post) => {
    console.log(post)
    await postDataAPI(`admin/product`, post).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setData([...data, mapData(res.data.product)]);
      return true;
    }).catch(err => {
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: { error: err.response.data.message } });
      return false;
    });
  }

  const handleDeleteRow = async (id) => {
    await deleteDataAPI(`admin/product/${id}`).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setData(data.filter((item) => parseInt(item.id) !== parseInt(id)));
      return true;
    }
    ).catch(err => {
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: { error: err.response.data.message } });
      return false;
    });
  }
  return (
    <div>
      <AdminTable
        title={"Product Management"}
        fields={fields}
        input_data={data}
        handleUpdateRow={handleUpdateRow}
        handleAddNewRow={handleAddNewRow}
        handleDeleteRow={handleDeleteRow}
      />
    </div>
  );
}

export default ProductManagement;