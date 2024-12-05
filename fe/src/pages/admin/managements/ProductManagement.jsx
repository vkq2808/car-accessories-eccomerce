import React, { useEffect, useState } from 'react';
import AdminTable from './AdminManagementTable';
import { admin_table_field_types } from '../../../constants/constants';
import { deleteDataAPI, getDataAPI, postDataAPI, putDataAPI } from '../../../utils/fetchData';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { useNavigate } from 'react-router-dom';
import ProductOptionManagement from './ProductOptionManagement';

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
      path: {
        value: item.path
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
      }, image_url: {
        value: item.image_url
      }, product_options: {
        props: {
          product_options: item.product_options,
          product_id: item.id
        }
      }
    }
  }

  useEffect(() => {
    if (!data || !data.length) {
      getDataAPI('admin/category').then(cate_res => {
        setCategoryData(cate_res.data.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        }));
        getDataAPI('admin/product').then(res => {
          setData(res.data.map((item) => {
            return mapData(item);
          }));
        }).catch(err => {
          if (err.response?.status === 403) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
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
      type: [admin_table_field_types.NO_FORM_DATA, admin_table_field_types.ID],
      value: ""
    },
    name: {
      type: [admin_table_field_types.TEXT],
      value: ""
    },
    path: {
      type: [admin_table_field_types.TEXT, admin_table_field_types.HIDDEN, admin_table_field_types.UNIQUE],
      checkExist: async (path) => {
        try {
          const res = await getDataAPI('product/detail/' + path);
          return res.data.product;
        } catch (err) {
          console.log(err);
          return false;
        }
      },
      value: ""
    },
    detail: {
      type: [admin_table_field_types.TEXTAREA, admin_table_field_types.HIDDEN],
      value: ""
    },
    stock: {
      type: [admin_table_field_types.NUMBER, admin_table_field_types.NO_FORM_DATA],
      value: ""
    },
    product_options: {
      type: [admin_table_field_types.TABLE, admin_table_field_types.HIDDEN, admin_table_field_types.NO_ADDABLE],
      value: "",
      child: ProductOptionManagement,
      setInputData: async (id) => {
        const res = await getDataAPI(`admin/product/${id}`).then(res => {
          return res.data.product;
        }).catch(err => {
          console.log(err);
          return false;
        });

        setData(data.map((item) => {
          if (parseInt(item.id.value) === parseInt(id)) {
            return mapData(res);
          }
          return item;
        }));
      },
      props: {
        product_options: "",
        product_id: ""
      }
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

  useEffect(() => {
    console.log(data[0])
  }, [data]);

  const handleUpdateRow = async (id, put) => {
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
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
    });
  }

  const handleAddNewRow = async (post) => {
    await postDataAPI(`admin/product`, post).then(res => {
      dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
      setData([...data, mapData(res.data.product)]);
      return true;
    }).catch(err => {
      dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
      return false;
    });
  }

  const handleDeleteRow = async (id) => {
    await deleteDataAPI(`admin/product/${id}`).then(res => {
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
        title={"Product Management"}
        fields={fields}
        input_data={data}
        handleUpdateRow={handleUpdateRow}
        handleAddNewRow={handleAddNewRow}
        handleDeleteRow={handleDeleteRow}
      />
    </div >
  );
}

export default ProductManagement;