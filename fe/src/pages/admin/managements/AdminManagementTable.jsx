import React, { useEffect, useRef, useState } from "react";
import { FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { BiLoaderAlt } from "react-icons/bi";
import { account_statuses, admin_table_field_types } from "../../../constants/constants";

const AdminTable = ({ title, fields, input_data, handleAddNewRow, handleUpdateRow, handleDeleteRow, rowsPerPage = 10, table_key = "1" }) => {
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

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, field]) => {
      let value = field.value;
      // nếu field yêu cầu phải có 
      // hoặc đang không edit field có loại là không cần edit
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
        fields[key]?.type.includes(admin_table_field_types.MINIMUN_LENGTH) &&
        value && value.length < fields[key].minimum_length
      ) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} must be at least ${fields[key].minimum_length} characters`;
      }
    });

    setErrors(newErrors);
    console.log("newErrors: ", newErrors)
    return Object.keys(newErrors).length === 0;
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const maximizeString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
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
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      let final_formData = {};
      Object.entries(fields).forEach(([key, field]) => {
        if (formData[key].value === "") {
          return;
        }
        if (fields[key].type.includes(admin_table_field_types.SELECT) ||
          fields[key].type.includes(admin_table_field_types.BADGE)) {
          // eslint-disable-next-line eqeqeq
          if (!fields[key].options.some(option => option.id == (formData[key].value))) {
            return;
          }
        }

        if (fields[key].type.includes(admin_table_field_types.NUMBER)) {
          final_formData[key] = parseInt(formData[key]?.value);
          return;
        }
        final_formData[key] = formData[key]?.value;
      });

      if (editingId) {
        handleUpdateRow(editingId, final_formData);
        setShowModal(false);
      } else {
        handleAddNewRow(final_formData);
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
    setFormData(fields);
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
    if (input_data) {
      setData(input_data);
      setIsLoading(false);
    }
    else {
      setIsLoading(true);
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
          return !fields[field].type.includes(admin_table_field_types.NO_SHOW_DATA) && item[field]?.value?.toString().toLowerCase().includes(key.toLowerCase())
        })
      );
    });

    setFilteredData(newData);
    setCurrentPage(1);
    setMaxPage(Math.ceil(newData.length / rowsPerPage) || 1);

  }, [data, sortedData, searchTerm, rowsPerPage, fields]);

  return (
    <div className="w-full mx-auto bg-[--primary-background-color] rounded-lg shadow-md shadow-[--quaternary-text-color] p-4">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[--primary-text-color]">{title}</h2>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="relative flex-1 mr-4">
            <div className="relative">
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
        </div>
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
          <tbody>
            {filteredData?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((item) => (
              <tr
                key={table_key + 'item' + item.id.value}
                className="hover:bg-[--secondary-background-color] transition-colors duration-200 group"
              >
                {
                  Object.keys(item)
                    .concat("Actions")
                    .map((field) => (
                      !fields[field]?.type.includes(admin_table_field_types.NO_SHOW_DATA) &&
                      <td key={table_key + field + '-' + item.id.value} className="px-3 py-2 text-xs whitespace-nowrap select-none">
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
                              ) : fields[field].type.includes(admin_table_field_types.SELECT) ? (
                                fields[field].options.find(option => option.id === item[field]?.value)?.display
                              ) : fields[field]?.type.includes(admin_table_field_types.NUMBER) ? (
                                new Intl.NumberFormat().format(item[field]?.value)
                              ) : fields[field].type.includes(admin_table_field_types.TEXTAREA) ? (
                                maximizeString(item[field]?.value, 15)
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
        <div className="flex items-center justify-end mt-4 gap-6">
          <div className="flex gap-6">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              Previous
            </button>
            <span className="text-[--primary-text-color]">|</span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === maxPage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
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

      {isLoading && (
        <div className="fixed inset-0 bg-[--primary-background-color] bg-opacity-50 flex items-center justify-center z-50">
          <BiLoaderAlt className="animate-spin text-[--primary-text-color] text-4xl" />
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"        >
          <div className="bg-[--primary-background-color] rounded-lg px-6 pb-4 w-full max-w-md max-h-[60vh] overflow-y-scroll scrollbar-hide">
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.keys(fields).map((field) => (
                (
                  (
                    !fields[field].type.includes(admin_table_field_types.NO_FORM_DATA)
                  )
                )
                &&
                (
                  <div key={table_key + 'field' + field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-[--primary-text-color]"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>

                    {
                      fields[field]?.type.includes(admin_table_field_types.SELECT) ||
                        fields[field]?.type.includes(admin_table_field_types.BADGE) ? (
                        <select
                          id={field}
                          value={formData[field]?.value ?? ""}
                          onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.value } })}
                          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
                        >
                          <option value={""}>Select {field}</option>
                          {fields[field]?.options?.map((option) => (
                            <option key={table_key + 'option-' + field + '-' + option.id} value={option.id}>
                              {option.display}
                            </option>
                          ))}
                        </select>
                      ) : fields[field].type.includes(admin_table_field_types.DATE) ? (
                        <input
                          type="date"
                          id={field}
                          value={formData[field]?.value && new Date(formData[field].value).toISOString().split('T')[0]}
                          onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.value } })}
                          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
                        />
                      ) : fields[field].type.includes(admin_table_field_types.NUMBER) ? (
                        <input
                          type="number"
                          id={field}
                          value={formData[field]?.value ?? ""}
                          onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.value } })}
                          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
                        />
                      ) : fields[field].type.includes(admin_table_field_types.EMAIL) ? (
                        <input

                          type="email"
                          id={field}
                          value={formData[field]?.value ?? ""}
                          onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.value } })}
                          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
                        />
                      ) : fields[field].type.includes(admin_table_field_types.PASSWORD) ? (
                        <input
                          autoComplete="new-password"
                          autoCorrect="off"
                          type="password"
                          id={field}
                          value={formData[field]?.value ?? ""}
                          onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.value } })}
                          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
                        />
                      ) : fields[field].type.includes(admin_table_field_types.TEXTAREA) ? (
                        <textarea
                          id={field}
                          rows={6}
                          value={formData[field]?.value ?? ""}
                          onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.value } })}
                          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
                        />
                      ) : (
                        <input
                          type={fields[field].type}
                          id={field}
                          value={formData[field]?.value ?? ""}
                          onChange={(e) => setFormData({ ...formData, [field]: { ...formData[field], value: e.target.value } })}
                          className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`}
                        />
                      )
                    }
                    {
                      errors[field] &&
                      <ErrorMessage errors={errors} field={field} />
                    }
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
        </div>
      )}
    </div >
  );
};


const ErrorMessage = ({ errors, field, ref }) => {
  const errorRef = useRef(null);

  useEffect(() => {
    // Nếu có lỗi, cuộn trang đến vị trí của thông báo lỗi
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


export default AdminTable;