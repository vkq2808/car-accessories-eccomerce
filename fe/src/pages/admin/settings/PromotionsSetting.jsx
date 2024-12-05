import { useEffect, useState } from "react";
import AdminTable from "../managements/AdminManagementTable";
import { admin_table_field_types } from "../../../constants/constants";
import { getDataAPI, postDataAPI, putDataAPI } from "../../../utils/fetchData";
import { PromotionSlider } from "../../../components";

const PromotionSetting = () => {

  const [promotionList, setPromotionList] = useState([]);
  const [promotionPreview, setPromotionPreview] = useState([]);
  const [original_data, setOriginalData] = useState([]);
  const [updated, setUpdated] = useState(false);
  const fetchPromotionList = async () => {
    try {
      const res = await getDataAPI("admin/promotion");
      setPromotionList(res.data.promotions.map(promotion => {
        return {
          id: { value: promotion.image_url },
          image_url: { value: promotion.image_url },
          link: { value: promotion.link }
        }
      }));
      setPromotionPreview(res.data.promotions);
    } catch (error) {
      console.error("Error fetching promotion list:", error);
    }
  }
  useEffect(() => {
    fetchPromotionList();
  }, []);

  useEffect(() => {
    const fetchOriginalData = async () => {
      try {
        const res = await getDataAPI("admin/promotion");
        setOriginalData(res.data.promotions);
      } catch (error) {
        console.error("Error fetching original promotion list:", error);
      }
    }
    if (original_data.length === 0) {
      fetchOriginalData();
    }
  }, [original_data]);


  const updatePromotionList = async (newPromotionList, canceling = false) => {
    try {
      const res = await putDataAPI("admin/promotion", { promotions: newPromotionList });
      if (res.status === 200)
        await fetchPromotionList();
      setUpdated(!canceling);
    } catch (error) {
      console.error("Error updating promotion list:", error);
    }
  }

  const handleCancelUpdate = async () => {
    updatePromotionList(original_data, true);
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
    link: {
      type: [admin_table_field_types.TEXT],
      value: "/search/q?category_id=-1"
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
    let newPromotion = { image_url: post.image_url, link: post.link };
    let newPromotionList = [...promotionList];
    newPromotionList = newPromotionList.map((promotion) => {
      return {
        image_url: promotion.image_url.value,
        link: promotion.link.value,
      };
    });
    newPromotionList.push(newPromotion);
    updatePromotionList(newPromotionList);
  }

  const handleUpdateRow = async (id, put) => {
    const newPromotionList = promotionList.map(promotion => {
      if (promotion.id.value === id) {
        return { image_url: put.image_url || promotion.image_url.value, link: put.link || promotion.link.value };
      }
      return {
        image_url: promotion.image_url.value,
        link: promotion.link.value,
      };
    });

    updatePromotionList(newPromotionList);
  }

  const handleDeleteRow = async (id) => {
    let newPromotionList = promotionList.filter(promotion => promotion.id.value !== id);
    newPromotionList = newPromotionList.map((promotion) => {
      return {
        image_url: promotion.image_url.value,
        link: promotion.link.value,
      };
    });
    updatePromotionList(newPromotionList);
  }

  const handleNavigate = (link) => {
    alert("Bạn sẽ được chuyển tới trang: " + process.env.REACT_APP_BASE_URL + "/" + link + "\nChức năng này đang được khóa vì đang trong xem trước");
  }

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <AdminTable
          fields={fields}
          title={"Promotion List"}
          input_data={promotionList}
          handleUpdateRow={handleUpdateRow}
          handleDeleteRow={handleDeleteRow}
          handleAddNewRow={handleAddNewRow}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h3 className="text-xl font-bold">Promotion Preview</h3>
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
        <PromotionSlider promotions={promotionPreview} handleNavigate={handleNavigate} />
      </div>
    </div>
  )
}

export default PromotionSetting;