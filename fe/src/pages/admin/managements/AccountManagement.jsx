import React, { useEffect, useState } from 'react';
import AdminTable from './AdminManagementTable';
import { account_gender, account_roles, admin_table_field_types, role_author_number } from '../../../constants/constants';
import { deleteDataAPI, getDataAPI, postDataAPI, putDataAPI } from '../../../utils/fetchData';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { useNavigate } from 'react-router-dom';

const AccountManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);

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
      image_url: {
        value: item.image_url,
      }
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
          dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
          // navigate('/auth/login');
        }
      });
    }
  }, [data, dispatch, navigate]);


  const havePermission = (req_role, user_role) => {
    return role_author_number[req_role] > role_author_number[user_role];
  }
  const fields = {
    id: {
      type: [admin_table_field_types.NO_FORM_DATA, admin_table_field_types.ID],
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
      type: [admin_table_field_types.EMAIL, admin_table_field_types.REQUIRED, admin_table_field_types.UNIQUE],
      checkExist: async (email) => {
        try {
          const res = await getDataAPI('admin/user/query?email=' + email);
          return res.data.users.length > 0; // Trả về danh sách user hoặc kết quả kiểm tra
        } catch (err) {
          console.log(err);
          return false; // Trả về false nếu có lỗi
        }
      },
      value: ""
    },
    role: {
      type: [admin_table_field_types.SELECT, admin_table_field_types.REQUIRED],
      options: Object.keys(account_roles).filter((key) => {
        return havePermission(auth.user.role, key);
      }).map((key) => {
        return { value: key, label: key }
      }),
      value: ""
    },
    gender: {
      type: [admin_table_field_types.SELECT],
      options: Object.keys(account_gender).map((key) => {
        return { value: key, label: key }
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
    image_url: {
      type: [admin_table_field_types.IMAGE],
      value: "",
      upload_function: async (file) => {
        try {
          if (!file) throw new Error("No file provided");

          const formData = new FormData();
          formData.append("file", file);

          const res = await postDataAPI("upload/image", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (res.status !== 200) throw new Error(res.data.message || "Upload failed");
          return res.data.url;
        } catch (err) {
          return false;
        }
      }
    }
  };

  const handleUpdateRow = async (id, put) => {
    await putDataAPI(`admin/user/${id}`, put).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      console.log(res.data.user, id);
      setData(data.map((item) => {
        if (parseInt(item.id.value) === parseInt(id)) {
          return mapData(res.data.user);
        }
        return item;
      }));
    }).catch(err => {
      console.log(err)
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
    });
  }

  const handleAddNewRow = async (post) => {
    await postDataAPI(`admin/user`, post).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setData([...data, mapData(res.data.user)]);
      return true;
    }).catch(err => {
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err });
      return false;
    });
  }

  const handleDeleteRow = async (id) => {
    await deleteDataAPI(`admin/user/${id}`).then(res => {
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