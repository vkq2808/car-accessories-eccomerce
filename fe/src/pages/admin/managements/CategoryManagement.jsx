import React, { useEffect, useState } from 'react';
import AdminTable from './AdminManagementTable';
import { admin_table_field_types } from '../../../constants/constants';
import { deleteDataAPI, getDataAPI, postDataAPI, putDataAPI } from '../../../utils/fetchData';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { useNavigate } from 'react-router-dom';

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const mapData = (item) => {
    return {
      id: {
        value: item.id
      },
      name: {
        value: item.name
      },
      path: {
        value: item.path
      },
      description: {
        value: item.description
      }
    }
  }

  useEffect(() => {
    if (!data || !data.length) {
      getDataAPI('admin/category').then(cate_res => {
        setData(cate_res.data.map((item) => {
          return mapData(item);
        }));
      }).catch(err => {
        console.log(err)
      });
    }
  }, [data, dispatch, navigate]);

  const fields = {
    id: {
      type: [admin_table_field_types.NO_FORM_DATA, admin_table_field_types.ID],
      value: ""
    },
    name: {
      type: [admin_table_field_types.TEXT],
      value: ""
    },
    path: {
      type: [admin_table_field_types.TEXT],
      value: "search/q?category_id="
    },
    description: {
      type: [admin_table_field_types.TEXT],
      value: ""
    }
  };

  const handleUpdateRow = async (id, put) => {
    console.log(put)
    await putDataAPI(`admin/category/${id}`, put).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setData(data.map((item) => {
        if (parseInt(item.id.value) === parseInt(id)) {
          return mapData(res.data.category);
        }
        return item;
      }));
    }).catch(err => {
      console.log(err)
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
    });
  }

  const handleAddNewRow = async (post) => {
    await postDataAPI(`admin/category`, post).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setData([...data, mapData(res.data.category)]);
      return true;
    }).catch(err => {
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
      return false;
    });
  }

  const handleDeleteRow = async (id) => {
    await deleteDataAPI(`admin/category/${id}`).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setData(data.filter((item) => parseInt(item.id.value) !== parseInt(id)));
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: "You deleted a category successfully" });
    }
    ).catch(err => {
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
      return false;
    });
  }
  return (
    <div>
      <AdminTable
        title={"Category Management"}
        fields={fields}
        input_data={data}
        handleUpdateRow={handleUpdateRow}
        handleAddNewRow={handleAddNewRow}
        handleDeleteRow={handleDeleteRow}
      />
    </div>
  );
}

export default CategoryManagement;