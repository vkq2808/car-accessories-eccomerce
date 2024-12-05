import React, { useEffect, useRef, useState } from "react";
import { FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { BiLoaderAlt } from "react-icons/bi";
import { admin_table_field_types } from "../../../constants/constants";
import { maximizeString } from "../../../utils/stringUtils";


const AdminTable = ({
  title,
  fields,
  input_data,
  handleAddNewRow,
  handleUpdateRow,
  handleDeleteRow,
  rowsPerPage = 10,
  table_key = "1",
  actable = true
}) => {
  const [data, setData] = useState(input_data);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(fields);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const validateForm = async () => {
    const newErrors = {};
    for (const key of Object.keys(fields)) {
      let value = formData[key].value;
      if (
        (
          fields[key]?.type.includes(admin_table_field_types.REQUIRED) || (
            editingId &&
            fields[key].type.includes(admin_table_field_types.NO_EDIT_REQUIRED)
          )
        ) && (
          !value && !(
            editingId &&
            fields[key].type.includes(admin_table_field_types.NO_EDIT_REQUIRED)
          )
        )
      ) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }

      if (
        fields[key]?.type.includes(admin_table_field_types.EMAIL) &&
        value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        newErrors[key] = "Invalid email address";
      }

      if (
        fields[key]?.type.includes(admin_table_field_types.NUMBER) &&
        value && isNaN(value)
      ) {
        newErrors[key] = "Invalid number";
      }

      if (
        fields[key]?.type.includes(admin_table_field_types.DATE) &&
        value && isNaN(Date.parse(value))
      ) {
        newErrors[key] = "Invalid date";
      }

      if (
        fields[key]?.type.includes(admin_table_field_types.DATE_TIME) &&
        value && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)
      ) {
        newErrors[key] = "Invalid date time";
      }

      if (
        fields[key]?.type.includes(admin_table_field_types.PASSWORD) &&
        value && value !== formData[key + "_confirm"].value
      ) {
        newErrors[key] = "Password does not match";
      }
      if (
        fields[key]?.type.includes(admin_table_field_types.MINIMUN_LENGTH) &&
        value && value.length < fields[key].minimum_length
      ) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} must be at least ${fields[key].minimum_length} characters`;
      }
      if (
        fields[key]?.type.includes(admin_table_field_types.UNIQUE) &&
        value && !editingId
      ) {
        let isExist = await fields[key].checkExist(value);
        if (isExist) {
          newErrors[key] = "This content is already in use";
        }
      }
    };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key].value < b[sortConfig.key].value) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key].value > b[sortConfig.key].value) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = await validateForm();
    if (!valid) {
      console.log("Invalid form");
      return;
    }

    setIsLoading(true);
    try {
      let final_formData = {};
      const original_data = data.find(item => item.id.value === editingId);

      for (const key of Object.keys(fields)) {
        const field = fields[key];
        const formValue = formData[key]?.value;
        const originalValue = original_data?.[key]?.value;

        // Bỏ qua nếu giá trị là rỗng
        if (formValue === "" || field.type.includes(admin_table_field_types.TABLE)) {
          continue;
        }

        // Hàm kiểm tra giá trị có trùng với dữ liệu gốc không
        // Nếu trùng và không phải là ID thì bỏ qua
        const isUnchanged = (value) => editingId && value === originalValue && !field.type.includes(admin_table_field_types.ID);

        // Xử lý theo từng loại field
        if (field.type.includes(admin_table_field_types.SELECT)) {
          // Nếu giá trị không nằm trong danh sách options thì bỏ qua
          // eslint-disable-next-line eqeqeq
          if (!field.options.some(option => option.value == formValue)) continue;
        }
        else if (field.type.includes(admin_table_field_types.NUMBER)) {
          const parsedValue = parseInt(formValue);
          if (isUnchanged(parsedValue)) continue;
          final_formData[key] = parsedValue;
          continue;
        }
        else if (field.type.includes(admin_table_field_types.IMAGE)) {
          if (typeof formValue === 'string') continue;
          const uploadedValue = await field.upload_function(formValue);
          if (isUnchanged(uploadedValue)) continue;
          final_formData[key] = uploadedValue;
          continue;
        }

        // Xử lý các loại field khác
        if (isUnchanged(formValue)) continue;
        final_formData[key] = formValue;
      }

      if (editingId) {
        await handleUpdateRow(editingId, final_formData);
        setShowModal(false);
      } else {
        await handleAddNewRow(final_formData);
        setShowModal(false);
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddnew = () => {
    setEditingId(null);
    let newFormData = {};

    Object.keys(fields).forEach((field) => {
      newFormData[field] = { value: fields[field].value || "" };
    });
    setFormData(newFormData);
    setShowModal(true);
  }

  const handleEdit = (item) => {
    let newFormData = { ...item };

    Object.keys(fields).forEach((field) => {
      if (fields[field].type.includes(admin_table_field_types.PASSWORD)) {
        newFormData[field].value = "";
      }
    });
    setFormData(newFormData);
    setEditingId(item.id.value);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    handleDeleteRow(id);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    setData(input_data);
    if (input_data.length > 0) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000)
    }
  }, [input_data]);

  useEffect(() => {
    let newData = [...data];
    if (Array.isArray(sortedData)) {
      newData = [...sortedData];
    }
    const keys = searchTerm.trim().split(" ");
    newData = newData.filter((item) => {
      return keys.every((key) =>
        Object.keys(fields).some((field) => {
          return !fields[field].type.includes(admin_table_field_types.HIDDEN) && item[field]?.value?.toString().toLowerCase().includes(key.toLowerCase())
        })
      );
    });

    setFilteredData(newData);
    setCurrentPage(1);
    setMaxPage(Math.ceil(newData.length / rowsPerPage) || 1);
  }, [data, sortedData, searchTerm, rowsPerPage, fields]);

  return (
    <div className="w-full mx-auto bg-[--primary-background-color] rounded-lg shadow-md shadow-[--quaternary-text-color] p-4">
      {(actable || title) && <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[--primary-text-color]">{title}</h2>
        {actable && <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-1 mr-4">
            <div className="">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-5 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search menu items"
              />
            </div>
          </div>
          <IoIosSearch cursor={'pointer'} size={24} />
        </div>}
        {actable && <button
          type="button"
          onClick={() => { handleAddnew() }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
          aria-label="Add new record"
        >
          <FaPlus /> Add New
        </button>}
      </div>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-inherit">
              {(actable ?
                Object.keys(
                  Object.entries(fields)
                    .filter(([key, value]) => !value.type.includes(admin_table_field_types.HIDDEN))
                    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
                ).concat("Actions")
                :
                (Object.keys(
                  Object.entries(fields)
                    .filter(([key, value]) => !value.type.includes(admin_table_field_types.HIDDEN))
                    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
                ))).map((header) => (
                  <th
                    key={table_key + 'header-' + header}
                    className="px-2 py-3 select-none text-left font-medium text-[--primary-text-color] bg-inherit uppercase tracking-wider cursor-pointer hover:bg-blue-400 transition-colors duration-200 text-sm"
                    onClick={() => header !== "Actions" && handleSort(header.toLowerCase())}
                  >
                    <div className="flex items-center gap-2">
                      {header}
                      {header !== "Actions" && (
                        <span className="text-[--primary-text-color]">
                          {sortConfig.key === header.toLowerCase() ? (
                            sortConfig.direction === "ascending" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>

          {isLoading ? (
            <tbody>
              <tr>
                <td colSpan={Object.keys(fields).length + 1} className="text-center py-4">
                  <BiLoaderAlt className="animate-spin text-[--primary-text-color] text-7xl" />
                </td>
              </tr>
            </tbody>
          ) :
            <tbody>
              {filteredData?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((item, index) => (
                <tr
                  key={table_key + 'item' + item.id.value + index}
                  className="hover:bg-[--secondary-background-color] transition-colors duration-200 group"
                >
                  {(actable ? Object.keys(fields).concat("Actions") : Object.keys(fields)).map((field) => (
                    <TableCell
                      key={table_key + field + '-' + item.id?.value + index}
                      field={field}
                      item={item}
                      fields={fields}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                      table_key={table_key}
                      setEditingId={setEditingId}
                      setShowConfirmDelete={setShowConfirmDelete}
                      index={index}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          }
        </table>
        <div className="flex items-center justify-end mt-4 gap-6">
          <div className="flex gap-6">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:opacity-90 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              Previous
            </button>
            <span className="text-[--primary-text-color]">|</span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === maxPage}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:opacity-90 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              Next
            </button>
          </div>
          <div>
            <span className="text-[--primary-text-color]">
              Page {currentPage} of {maxPage}
            </span>
          </div>
        </div>
      </div>

      {
        showConfirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[--primary-background-color] rounded-lg px-6 pb-4 w-full max-w-md max-h-[60vh] overflow-y-scroll scrollbar-hide">
              <div className="flex justify-between items-center w-full py-4 sticky bg-inherit top-0 left-0">
                <h3 className="text-lg font-semibold">Confirm Delete</h3>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="text-[--primary-text-color] bg-[--primary-background-color] hover:text-[--primary-text-color] transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <IoMdClose size={24} />
                </button>
              </div>
              <div className="p-4">
                <p className="text-[--primary-text-color]">Are you sure you want to delete this record?</p>
                <div className="flex justify-end mt-4 gap-10">
                  <button
                    onClick={() => {
                      handleDelete(editingId);
                      setShowConfirmDelete(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                  >
                    Cancel
                  </button>

                </div>
              </div>
            </div>
          </div>
        )
      }

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"        >
          <div className="bg-[--primary-background-color] rounded-lg px-6 pb-4 w-full max-w-2xl max-h-[60vh] overflow-y-scroll scrollbar-hide">
            <div className="flex justify-between items-center w-full py-4 sticky bg-inherit top-0 left-0">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit Record" : "Add New Record"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[--primary-text-color] bg-[--primary-background-color] hover:text-[--primary-text-color] transition-colors duration-200"
                aria-label="Close modal"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {Object.keys(fields).map((field) => (
                <div key={table_key + 'field' + field}>
                  <DisplayField
                    tank_key={table_key}
                    field={field}
                    fields={fields}
                    table_key={table_key}
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    editingId={editingId} />
                  {
                    errors[field] &&
                    <ErrorMessage errors={errors} field={field} />
                  }
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                  {isLoading ? <BiLoaderAlt /> : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

const TableCell = ({ field, item, fields, handleEdit, handleDelete, table_key, setEditingId, setShowConfirmDelete, index }) => {
  if (fields[field]?.type.includes(admin_table_field_types.HIDDEN)) {
    return null;
  }

  return (
    <td key={table_key + field + '-' + item.id?.value + index} className="px-3 py-2 text-xs whitespace-nowrap select-none">
      {field !== "Actions" ? (
        fields[field]?.type.includes(admin_table_field_types.IMAGE) ? (
          <img src={item[field].value} alt="" className="w-8 h-8 rounded-[30%]" />
        ) : fields[field]?.type.includes(admin_table_field_types.DATE) ? (
          new Date(item[field]?.value).toLocaleDateString('vi-VN')
        ) : fields[field]?.type.includes(admin_table_field_types.DATE_TIME) ? (
          new Date(item[field]?.value).toLocaleString('vi-VN')
        ) : fields[field]?.type.includes(admin_table_field_types.SELECT) ? (
          fields[field].options.find(option => option.value === item[field]?.value)?.label || item[field]?.value
        ) : fields[field]?.type.includes(admin_table_field_types.NUMBER) ? (
          new Intl.NumberFormat().format(item[field]?.value)
        ) : fields[field]?.type.includes(admin_table_field_types.TEXTAREA) ? (
          maximizeString(item[field]?.value, 20)
        ) : fields[field]?.type.includes(admin_table_field_types.JSON) ?
          (<JsonViewer
            data={item[field]?.value}
          />) : (
            maximizeString(item[field]?.value, 20)
          )
      ) : (
        <div className="flex gap-3">
          <div
            onClick={() => handleEdit(item)}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
            aria-label="Edit record"
          >
            <FaEdit size={18} />
          </div>
          <div
            onClick={() => {
              setEditingId(item.id.value);
              setShowConfirmDelete(true);
            }}
            className="text-red-600 hover:text-red-800 transition-colors duration-200 cursor-pointer"
            aria-label="Delete record"
          >
            <FaTrash size={18} />
          </div>
        </div>
      )}
    </td>
  );
};

const DisplayField = ({ table_key, field, fields, formData, setFormData, errors, editingId }) => {
  const fieldProps = fields[field];

  if (!fieldProps || fieldProps.type.includes(admin_table_field_types.NO_FORM_DATA)) return null;
  if (!editingId && fieldProps.type.includes(admin_table_field_types.NO_ADDABLE)) return null;

  const fieldLabel = (
    <label
      htmlFor={field}
      className="block text-sm font-medium text-[--primary-text-color]"
    >
      {field.charAt(0).toUpperCase() + field.slice(1)}
      {fieldProps.type.includes(admin_table_field_types.REQUIRED) && "*"}
      {fieldProps.type.includes(admin_table_field_types.NO_EDIT_REQUIRED) && editingId && (<span className="text-xs">" (Optional Editing)"</span>)}
    </label>
  );

  if (fieldProps.type.includes(admin_table_field_types.CHILD_SELECT)) {
    for (const key of Object.keys(fields)) {
      if (
        key === fieldProps.parent_key &&
        (
          formData[key]?.value === "" ||
          formData[key]?.value !== fieldProps.child_key
        )
      ) {
        return null;
      }
    }
  }

  if (fieldProps.type.includes(admin_table_field_types.SELECT)) {
    return (
      <>
        {fieldLabel}
        <select
          id={field}
          value={formData[field]?.value ?? ""}
          disabled={editingId && fieldProps.type.includes(admin_table_field_types.NO_EDITABLE)}
          onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.value } })}
          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
        >
          <option value="">Select {field}</option>
          {fieldProps.options?.map((option) => (
            <option key={table_key + 'option-' + field + '-' + option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </>
    );
  }

  if (fieldProps.type.includes(admin_table_field_types.DATE)) {
    return (
      <>
        {fieldLabel}
        <input
          type="date"
          id={field}
          disabled={editingId && fieldProps.type.includes(admin_table_field_types.NO_EDITABLE)}
          value={formData[field]?.value && new Date(formData[field].value).toISOString().split('T')[0]}
          onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.value } })}
          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
        />
      </>
    );
  }

  if (fieldProps.type.includes(admin_table_field_types.NUMBER)) {
    return (
      <>
        {fieldLabel}
        <input
          type="number"
          id={field}
          disabled={editingId && fieldProps.type.includes(admin_table_field_types.NO_EDITABLE)}
          value={formData[field]?.value ?? ""}
          onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.value } })}
          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
        />
      </>
    );
  }

  if (fieldProps.type.includes(admin_table_field_types.EMAIL)) {
    return (
      <>
        {fieldLabel}
        <input
          type="email"
          id={field}
          disabled={editingId && fieldProps.type.includes(admin_table_field_types.NO_EDITABLE)}
          value={formData[field]?.value ?? ""}
          onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.value } })}
          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
        />
      </>
    );
  }

  if (fieldProps.type.includes(admin_table_field_types.PASSWORD)) {
    return (
      <>
        {fieldLabel}
        <input
          autoComplete="new-password"
          autoCorrect="off"
          type="password"
          id={field}
          disabled={editingId && fieldProps.type.includes(admin_table_field_types.NO_EDITABLE)}
          value={formData[field]?.value ?? ""}
          onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.value } })}
          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
        />
        <input
          autoComplete="new-password"
          autoCorrect="off"
          type="password"
          id={field + "_confirm"}
          disabled={editingId && fieldProps.type.includes(admin_table_field_types.NO_EDITABLE)}
          value={formData[field + "_confirm"]?.value ?? ""}
          onChange={(e) => setFormData({ ...formData, [field + "_confirm"]: { ...formData[field + "_confirm"], value: e.target.value } })}
          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
        />
      </>
    );
  }
  if (fieldProps.type.includes(admin_table_field_types.TABLE)) {
    return (
      <>
        {fieldLabel}
        <fieldProps.child {...formData[field].props} setInputData={(data, id) => fieldProps.setInputData(data, id)} />
      </>
    )
  }

  if (fieldProps.type.includes(admin_table_field_types.TEXTAREA)) {
    return (
      <>
        {fieldLabel}
        <textarea
          id={field}
          rows={6}
          disabled={editingId && fieldProps.type.includes(admin_table_field_types.NO_EDITABLE)}
          value={formData[field]?.value ?? ""}
          onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.value } })}
          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
        />
      </>
    );
  }

  if (fieldProps.type.includes(admin_table_field_types.JSON)) {
    return (
      <>
        {fieldLabel}
        <textarea
          id={field}
          rows={6}
          disabled={editingId && fieldProps.type.includes(admin_table_field_types.NO_EDITABLE)}
          value={formData[field]?.value ?? ""}
          onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.value } })}
          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
        />
      </>
    );
  }

  if (fieldProps.type.includes(admin_table_field_types.QUERY)) {

    return (
      <>
        {fieldLabel}
        <input
          type="text"
          id={table_key + field}
          disabled={editingId && fieldProps.type.includes(admin_table_field_types.NO_EDITABLE)}
          value={(formData[field]?.display || formData[field]?.query) ?? ""}
          onChange={(e) => {
            const queryValue = e.target.value;
            setFormData((prevFormData) => ({
              ...prevFormData,
              [field]: { ...prevFormData[field], value: "" }
            }));
            fields[field].query_function(queryValue).then((options) => {
              setFormData((prevFormData) => ({
                ...prevFormData,
                [field]: { ...prevFormData[field], options, query: queryValue }
              }));
            });
          }}
          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
        />
        <ul className="absolute w-[400px] bg-white border border-gray-200 rounded-md mt-1 shadow-lg">
          {formData[field].options?.slice(0, 5).map((option) => (
            <li
              key={option.value}
              onClick={() => {
                setFormData({ ...formData, [field]: { ...formData[field], value: option.value, display: option.label, options: [] } });
              }}
              className="p-2 cursor-pointer hover:bg-gray-100 list-none "
            >
              {option.label}
            </li>
          ))}
        </ul>
      </>
    );
  }

  if (fieldProps.type.includes(admin_table_field_types.IMAGE)) {
    return (
      <>
        {fieldLabel}
        <input
          type="file"
          accept="image/*"
          id={field}
          disabled={editingId && fieldProps.type.includes(admin_table_field_types.NO_EDITABLE)}
          onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.files[0] } })}
          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
        />
        {
          formData[field]?.value && (
            <img
              src={typeof formData[field].value === 'string' ? formData[field].value : URL.createObjectURL(formData[field].value)}
              alt={field}
              className="w-8 h-8 rounded-[30%] mt-2"
            />
          )
        }
      </>
    );
  }

  return (
    <>
      {fieldLabel}
      <input
        type={fieldProps.type}
        id={field}
        disabled={editingId && fieldProps.type.includes(admin_table_field_types.NO_EDITABLE)}
        value={formData[field]?.value ?? ""}
        onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.value } })}
        className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
      />
    </>
  );
};


const ErrorMessage = ({ errors, field, ref }) => {
  const errorRef = useRef(null);

  useEffect(() => {
    if (errors[field]) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errors, field]);

  return (
    <>
      {errors[field] && (
        <p ref={errorRef} className="text-red-500 text-sm">
          {errors[field]}
        </p>
      )}
    </>
  );
};


export const JsonViewer = ({ data }) => {
  const renderJson = (data) => {
    if (typeof data === 'object' && data !== null) {
      return (
        <ul className='flex flex-col'>
          {Object.keys(data).map((key) => (
            <li key={key} className="list-none">
              <strong>{key}:</strong> {renderJson(data[key])}
            </li>
          ))}
        </ul>
      );
    } else {
      return <span>{maximizeString(String(data ?? ""), 10)}</span>
    }
  };

  return <div>{renderJson(data) || ""}</div>;
};


export default AdminTable;