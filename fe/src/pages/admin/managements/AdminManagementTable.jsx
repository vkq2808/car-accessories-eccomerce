import React, { useEffect, useState } from "react";
import { FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BiLoaderAlt } from "react-icons/bi";
import { account_statuses, admin_table_field_types } from "../../../constants/constants";

const AdminTable = ({ title, fields, input_data, handleAddNewRow, handleUpdateRow, handleDeleteRow }) => {
  const [data, setData] = useState(input_data);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(fields);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (fields[key]?.required && !value) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });

    Object.entries(formData).forEach(([key, value]) => {
      if (fields[key]?.type === admin_table_field_types.EMAIL && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[key] = "Invalid email address";
      }
    });

    Object.entries(formData).forEach(([key, value]) => {
      if (fields[key]?.type === admin_table_field_types.NUMBER && value && isNaN(value)) {
        newErrors[key] = "Invalid number";
      }
    });

    Object.entries(formData).forEach(([key, value]) => {
      if (fields[key]?.type === admin_table_field_types.DATE && value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        newErrors[key] = "Invalid date";
      }
    });

    Object.entries(formData).forEach(([key, value]) => {
      if (fields[key]?.type === admin_table_field_types.DATE_TIME && value && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
        newErrors[key] = "Invalid date time";
      }
    });

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
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (editingId) {
        const updatedData = data.map((item) =>
          item.id === editingId ? { ...formData, id: editingId } : item
        );
        setData(updatedData);
      } else {
        const newId = Math.max(...data.map((item) => item.id)) + 1;
        setData([...data, { ...formData, id: newId }]);
      }
      setShowModal(false);
      setFormData(fields);
      setEditingId(null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddnew = () => {
    setEditingId(null);
    setFormData(fields);
    setShowModal(true);
  }

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id.value);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (input_data) {
      setData(input_data);
      setIsLoading(false);
    }
    else
      setIsLoading(true);
  }, [input_data]);

  return (
    <div className="w-full mx-auto bg-[--primary-background-color] rounded-lg shadow-md shadow-[--quaternary-text-color] p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[--primary-text-color]">{title}</h2>
        <button
          onClick={() => { handleAddnew() }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
          aria-label="Add new record"
        >
          <FaPlus /> Add New
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-inherit">
              {Object.keys(
                Object.entries(fields)
                  .filter(([key, value]) => !value.type.includes(admin_table_field_types.NO_SHOW_DATA))
                  .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
              )
                .concat("Actions").map((header) => (
                  <th
                    key={'header-' + header}
                    className="px-6 py-3 select-none text-left text-xs font-medium text-[--primary-text-color] bg-inherit uppercase tracking-wider cursor-pointer hover:bg-blue-400 transition-colors duration-200"
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
          <tbody>
            {sortedData.map((item) => (
              <tr
                key={'item' + item.id.value}
                className="hover:bg-[--secondary-background-color] transition-colors duration-200 group"
              >
                {
                  Object.keys(item)
                    .concat("Actions")
                    .map((field) => (
                      !fields[field]?.type.includes(admin_table_field_types.NO_SHOW_DATA) &&
                      <td key={field + '-' + item.id.value} className="px-6 py-4 whitespace-nowrap select-none">
                        {
                          field !== "Actions" ? (
                            fields[field]?.type.includes(admin_table_field_types.IMAGE) ? (
                              <img src={item[field].value} alt={item.name} className="w-8 h-8 rounded-full" />
                            ) : fields[field]?.type.includes(admin_table_field_types.BADGE) ? (
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item[field].value === account_statuses.Active ? "bg-green-100 text-green-800" : item[field].value === account_statuses.Inactive ? "bg-red-100 text-red-800" : "bg-[--primary-text-color] text-[--primary-background-color]"}`} >
                                {item[field]?.value}
                              </span>
                            ) :
                              fields[field]?.type.includes(admin_table_field_types.DATE) ? (
                                new Date(item[field]?.value).toLocaleDateString('vi-VN')
                              ) : fields[field]?.type.includes(admin_table_field_types.DATE_TIME) ? (
                                new Date(item[field]?.value).toLocaleString('vi-VN')
                              ) : fields[field]?.type.includes(admin_table_field_types.NUMBER) ? (
                                new Intl.NumberFormat().format
                              ) : (
                                item[field]?.value
                              )
                          )
                            : (
                              <div className="flex gap-3">
                                <div
                                  onClick={() => handleEdit(item)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
                                  aria-label="Edit record"
                                >
                                  <FaEdit size={18} />
                                </div>
                                <div
                                  onClick={() => handleDelete(item.id)}
                                  className="text-red-600 hover:text-red-800 transition-colors duration-200 cursor-pointer"
                                  aria-label="Delete record"
                                >
                                  <FaTrash size={18} />
                                </div>
                              </div>
                            )}
                      </td>
                    ))
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-[--primary-background-color] bg-opacity-50 flex items-center justify-center z-50">
          <BiLoaderAlt className="animate-spin text-[--primary-text-color] text-4xl" />
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[--primary-background-color] rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.keys(fields).map((field) => (
                (!(fields[field].type.includes(admin_table_field_types.NO_FORM_DATA) && !fields[field].type.includes(admin_table_field_types.NO_SHOW_DATA)) || (fields[field].type === admin_table_field_types.NO_SHOW_DATA && !editingId))
                && (
                  <div key={'field' + field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-[--primary-text-color]"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>

                    {fields[field]?.type.includes(admin_table_field_types.SELECT) || fields[field]?.type.includes(admin_table_field_types.BADGE) ? (
                      <select
                        id={field}
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
                      >
                        <option value="">Select {field}</option>
                        {fields[field]?.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) :
                      fields[field].type.includes(admin_table_field_types.DATE) ? (
                        <input
                          type="date"
                          id={field}
                          value={formData[field]?.value && new Date(formData[field].value).toISOString().split('T')[0]}
                          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
                        />
                      ) :
                        (
                          <input
                            type={fields[field].type}
                            id={field}
                            value={formData[field]?.value}
                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                            className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
                          />
                        )}
                    {errors[field] && (
                      <p className="text-red-500 text-sm">{errors[field]}</p>
                    )}
                  </div>
                )))}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                  {isLoading ? <BiLoaderAlt /> : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div >
      )}
    </div >
  );
};

export default AdminTable;