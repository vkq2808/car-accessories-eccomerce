import React, { useEffect, useState } from 'react';
import AdminTable from './AdminManagementTable';
import { account_gender, account_roles, admin_table_field_types } from '../../../constants/constants';
import { deleteDataAPI, getDataAPI, postDataAPI, putDataAPI } from '../../../utils/fetchData';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { useNavigate } from 'react-router-dom';

const AccountManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const mapData = (item) => {
    return {
      id: {
        value: item.id,
      },
      first_name: {
        value: item.first_name,
      },
      last_name: {
        value: item.last_name,
      },
      email: {
        value: item.email,
      },
      password: {
        value: item.hashed_password,
      },
      role: {
        value: item.role,
      },
      gender: {
        value: item.gender,
      },
      phone: {
        value: item.phone,
      },
      birth: {
        value: item.birth,
      },
      address: {
        value: item.address,
      },
    }
  }

  useEffect(() => {
    if (!data || !data.length) {
      getDataAPI('admin/user').then(res => {
        setData(res.data.map((item) => {
          return mapData(item);
        }));
      }
      ).catch(err => {
        if (err.response.status === 403) {
          dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: { error: err.response.data.message } });
          // navigate('/auth/login');
        }
      });
    }
  }, [data, dispatch, navigate]);

  const fields = {
    id: {
      type: [admin_table_field_types.NO_FORM_DATA],
      value: ""
    },
    first_name: {
      type: [admin_table_field_types.TEXT, admin_table_field_types.REQUIRED],
      value: ""
    },
    last_name: {
      type: [admin_table_field_types.TEXT, admin_table_field_types.REQUIRED],
      value: ""
    },
    email: {
      type: [admin_table_field_types.EMAIL, admin_table_field_types.REQUIRED],
      value: ""
    },
    password: {
      type: [admin_table_field_types.PASSWORD, admin_table_field_types.NO_SHOW_DATA, admin_table_field_types.REQUIRED, admin_table_field_types.NO_EDIT_REQUIRED, admin_table_field_types.MINIMUN_LENGTH
      ],
      minimum_length: 8,
      value: ""
    },
    role: {
      type: [admin_table_field_types.SELECT, admin_table_field_types.REQUIRED],
      options: Object.keys(account_roles).map((key) => {
        return { id: key, display: key }
      }),
      value: ""
    },
    gender: {
      type: [admin_table_field_types.SELECT],
      options: Object.keys(account_gender).map((key) => {
        return { id: key, display: key }
      }),
      value: ""
    },
    phone: {
      type: [admin_table_field_types.TEXT],
      value: ""
    },
    birth: {
      type: [admin_table_field_types.DATE, admin_table_field_types.REQUIRED],
      value: ""
    },
    address: {
      type: [admin_table_field_types.TEXT],
      value: ""
    },
  };

  const handleUpdateRow = async (id, put) => {
    await putDataAPI(`admin/user/${id}`, put).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setData(data.map((item) => {
        if (parseInt(item.id) === parseInt(id)) {
          return mapData(res.data.user);
        }
        return item;
      }));
      return true;
    }).catch(err => {
      console.log(err)
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: { error: err.response.data.message } });
      return false;
    });
  }

  const handleAddNewRow = async (post) => {
    console.log(post)
    await postDataAPI(`admin/user`, post).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setData([...data, mapData(res.data.user)]);
      return true;
    }).catch(err => {
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: { error: err.response.data.message } });
      return false;
    });
  }

  const handleDeleteRow = async (id) => {
    await deleteDataAPI(`admin/user/${id}`).then(res => {
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
        title={"Account Management"}
        fields={fields}
        input_data={data}
        handleUpdateRow={handleUpdateRow}
        handleAddNewRow={handleAddNewRow}
        handleDeleteRow={handleDeleteRow}
      />
    </div>
  );
}

export default AccountManagement;