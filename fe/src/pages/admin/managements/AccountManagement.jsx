import React, { useEffect, useState } from 'react';
import AdminTable from './AdminManagementTable';
import { account_gender, account_roles, admin_table_field_types } from '../../../constants/constants';
import { getDataAPI } from '../../../utils/fetchData';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { useNavigate } from 'react-router-dom';

const AccountManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  useEffect(() => {
    if (!data || !data.length) {
      getDataAPI('admin/user').then(res => {
        // setData(res.data);
        console.log(res.data);
        setData(res.data.map((item) => {
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
              value: item.gender || "Ẩn",
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
          };
        }));
      }
      ).catch(err => {
        if (err.response.status === 403) {
          dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: { error: err.response.data.msg } });
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
      type: [admin_table_field_types.TEXT],
      value: ""
    },
    last_name: {
      type: [admin_table_field_types.TEXT],
      value: ""
    },
    email: {
      type: [admin_table_field_types.EMAIL],
      value: ""
    },
    password: {
      type: [admin_table_field_types.NO_SHOW_DATA],
      value: ""
    },
    role: {
      type: [admin_table_field_types.BADGE],
      options: Object.keys(account_roles),
      value: ""
    },
    gender: {
      type: [admin_table_field_types.BADGE],
      options: Object.keys(account_gender),
      value: ""
    },
    phone: {
      type: [admin_table_field_types.TEXT],
      value: ""
    },
    birth: {
      type: [admin_table_field_types.DATE],
      value: ""
    },
    address: {
      type: [admin_table_field_types.TEXT]
    },
  };

  return (
    <div>
      <AdminTable
        title={"Account Management"}
        fields={fields}
        input_data={data}
      />
    </div>
  );
}

export default AccountManagement;