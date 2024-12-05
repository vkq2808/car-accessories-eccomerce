import { useEffect, useState } from "react";
import AdminTable from "../managements/AdminManagementTable";
import { admin_table_field_types } from "../../../constants/constants";
import { getDataAPI, postDataAPI, putDataAPI } from "../../../utils/fetchData";
import { Policies } from "../../../components";

const PoliciesSetting = () => {

  const [policiesList, setPoliciesList] = useState([]);
  const [policiesPreview, setPoliciesPreview] = useState([]);
  const [original_data, setOriginalData] = useState([]);
  const [updated, setUpdated] = useState(false);

  const fetchPoliciesList = async () => {
    try {
      const res = await getDataAPI("admin/policies");
      setPoliciesList(res.data.policies.map(policy => {
        return {
          id: { value: policy.image_url },
          image_url: { value: policy.image_url },
          title: { value: policy.title },
          content: { value: policy.content }
        }
      }));
      setPoliciesPreview(res.data.policies);
    } catch (error) {
      console.error("Error fetching policies list:", error);
    }
  }
  useEffect(() => {
    fetchPoliciesList();
  }, []);

  useEffect(() => {
    const fetchOriginalData = async () => {
      try {
        const res = await getDataAPI("admin/policies");
        setOriginalData(res.data.policies);
      } catch (error) {
        console.error("Error fetching original policies list:", error);
      }
    }
    if (original_data.length === 0) {
      fetchOriginalData();
    }
  }, [original_data]);


  const updatePoliciesList = async (newPoliciesList, canceling = false) => {
    try {
      const res = await putDataAPI("admin/policies", { policiess: newPoliciesList });
      if (res.status === 200)
        await fetchPoliciesList();
      setUpdated(!canceling);
    } catch (error) {
      console.error("Error updating policies list:", error);
    }
  }

  const handleCancelUpdate = async () => {
    updatePoliciesList(original_data, true);
  }

  const handleSaveUpdate = () => {
    setOriginalData([]);
    setUpdated(false);
  }

  const fields = {
    id: {
      type: [admin_table_field_types.NO_FORM_DATA, admin_table_field_types.HIDDEN],
      value: ""
    },
    title: {
      type: [admin_table_field_types.TEXT],
      value: ""
    },
    content: {
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
    },
  }

  const handleAddNewRow = async (post) => {
    let newPolicy = { image_url: post.image_url, link: post.link };
    let newPoliciesList = [...policiesList];
    newPoliciesList = newPoliciesList.map((policy) => {
      return {
        image_url: policy.image_url.value,
        title: policy.title.value,
        content: policy.content.value,
      };
    });
    newPoliciesList.push(newPolicy);
    updatePoliciesList(newPoliciesList);
  }

  const handleUpdateRow = async (id, put) => {
    const newPoliciesList = policiesList.map(policy => {
      if (policy.id.value === id) {
        return {
          image_url: put.image_url || policy.image_url.value,
          title: put.title || policy.title.value,
          content: put.content || policy.content.value
        };
      }
      return {
        image_url: policy.image_url.value,
        title: policy.title.value,
        content: policy.content.value,
      };
    });

    updatePoliciesList(newPoliciesList);
  }

  const handleDeleteRow = async (id) => {
    let newPoliciesList = policiesList.filter(policies => policies.id.value !== id);
    newPoliciesList = newPoliciesList.map((policy) => {
      return {
        image_url: policy.image_url.value,
        title: policy.title.value,
        content: policy.content.value,
      };
    });
    updatePoliciesList(newPoliciesList);
  }

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <AdminTable
          fields={fields}
          title={"Policies List"}
          input_data={policiesList}
          handleUpdateRow={handleUpdateRow}
          handleDeleteRow={handleDeleteRow}
          handleAddNewRow={handleAddNewRow}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h3 className="text-xl font-bold">Policies Preview</h3>
          <div className="flex">
            {
              updated && (
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={() => handleSaveUpdate()}
                >
                  Save
                </button>
              )
            }
            {
              updated && (
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={handleCancelUpdate}
                >
                  Cancel
                </button>
              )
            }
          </div>
        </div>
        <Policies policies={policiesPreview} />
      </div>
    </div>
  )
}

export default PoliciesSetting;