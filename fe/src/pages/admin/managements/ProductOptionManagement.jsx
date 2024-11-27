
import React, { useEffect, useState } from 'react';
import AdminTable from './AdminManagementTable';
import { admin_table_field_types } from '../../../constants/constants';
import { deleteDataAPI, postDataAPI, putDataAPI } from '../../../utils/fetchData';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { useNavigate } from 'react-router-dom';

const ProductOptionManagement = ({ product_options, product_id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const mapData = (item) => {
    return {
      id: {
        value: item.id
      },
      product_id: {
        value: item.product_id
      },
      name: {
        value: item.name
      },
      price: {
        value: item.price
      },
      stock: {
        value: item.stock
      }
    }
  }

  useEffect(() => {
    setData(product_options?.map((item) => mapData(item)) || []);
  }, [dispatch, navigate, product_options]);

  const fields = {
    id: {
      type: [admin_table_field_types.NO_FORM_DATA, admin_table_field_types.ID],
      value: ""
    },
    product_id: {
      type: [admin_table_field_types.NO_FORM_DATA, admin_table_field_types.ID],
      value: product_id
    },
    name: {
      type: [admin_table_field_types.TEXT],
      value: ""
    },
    price: {
      type: [admin_table_field_types.NUMBER],
      value: ""
    },
    stock: {
      type: [admin_table_field_types.NUMBER],
      value: ""
    }
  };

  const handleUpdateRow = async (id, put) => {
    await putDataAPI(`admin/product_option/${id}`, put).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setData(data.map((item) => {
        if (parseInt(item.id.value) === parseInt(id)) {
          return mapData(res.data.product_option);
        }
        return item;
      }));
    }).catch(err => {
      console.log(err)
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
    });
  }

  const handleAddNewRow = async (post) => {
    await postDataAPI(`admin/product_option`, post).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setData([...data, mapData(res.data.product_option)]);
      return true;
    }).catch(err => {
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
      return false;
    });
  }

  const handleDeleteRow = async (id) => {
    await deleteDataAPI(`admin/product_option/${id}`).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setData(data.filter((item) => parseInt(item.id.value) !== parseInt(id)));
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
        fields={fields}
        input_data={data}
        handleUpdateRow={handleUpdateRow}
        handleAddNewRow={handleAddNewRow}
        handleDeleteRow={handleDeleteRow}
      />
    </div >
  );
}

export default ProductOptionManagement;