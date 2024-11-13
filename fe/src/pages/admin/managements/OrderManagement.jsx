// import React, { useEffect, useState } from 'react';
// import AdminTable from './AdminManagementTable';
// import { admin_table_field_types } from '../../../constants/constants';
// import { deleteDataAPI, getDataAPI, postDataAPI, putDataAPI } from '../../../utils/fetchData';
// import { useDispatch } from 'react-redux';
// import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
// import { useNavigate } from 'react-router-dom';

// const ProductManagement = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [data, setData] = useState([]);
//   const [categoryData, setCategoryData] = useState([]);

//   const mapData = (item) => {
//     return {
//     }
//   }

//   useEffect(() => {
//     if (!data || !data.length) {
//     }
//   }, [data, dispatch, navigate]);

//   const fields = {
//     id: {
//       type: [admin_table_field_types.NO_FORM_DATA],
//       value: ""
//     }
//   };

//   const handleUpdateRow = async (id, put) => {
//     console.log(put)
//     await putDataAPI(`admin/product/${id}`, put).then(res => {
//       dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
//       setData(data.map((item) => {
//         if (parseInt(item.id.value) === parseInt(id)) {
//           return mapData(res.data.product);
//         }
//         return item;
//       }));
//     }).catch(err => {
//       console.log(err)
//       dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: { error: err.response.data.message } });
//     });
//   }

//   const handleAddNewRow = async (post) => {
//     console.log(post)
//     await postDataAPI(`admin/product`, post).then(res => {
//       dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
//       setData([...data, mapData(res.data.product)]);
//       return true;
//     }).catch(err => {
//       dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: { error: err.response.data.message } });
//       return false;
//     });
//   }

//   const handleDeleteRow = async (id) => {
//     await deleteDataAPI(`admin/product/${id}`).then(res => {
//       dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
//       setData(data.filter((item) => parseInt(item.id) !== parseInt(id)));
//       return true;
//     }
//     ).catch(err => {
//       dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: { error: err.response.data.message } });
//       return false;
//     });
//   }
//   return (
//     <div>
//       <AdminTable
//         title={"Product Management"}
//         fields={fields}
//         input_data={data}
//         handleUpdateRow={handleUpdateRow}
//         handleAddNewRow={handleAddNewRow}
//         handleDeleteRow={handleDeleteRow}
//       />
//     </div>
//   );
// }

// export default ProductManagement;