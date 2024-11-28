import { useEffect, useState } from "react";
import AdminTable from "../managements/AdminManagementTable";
import { admin_table_field_types } from "../../../constants/constants";
import { getDataAPI, postDataAPI, putDataAPI } from "../../../utils/fetchData";
import { PromotionSlider } from "../../../components";

const PromotionSetting = () => {

  const [promotionList, setPromotionList] = useState([]);
  const [promotionPreview, setPromotionPreview] = useState([]);
  const fetchPromotionList = async () => {
    try {
      const res = await getDataAPI("admin/promotion");
      setPromotionList(res.data.promotions.map(promotion => {
        return {
          id: { value: promotion.img },
          img: { value: promotion.img },
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
  }, [])

  const updatePromotionList = async (newPromotionList) => {
    try {
      const res = await putDataAPI("admin/promotion", { promotions: newPromotionList });
      if (res.status === 200)
        fetchPromotionList();
    } catch (error) {
      console.error("Error updating promotion list:", error);
    }
  }

  const fields = {
    id: {
      type: [admin_table_field_types.NO_FORM_DATA, admin_table_field_types.NO_SHOW_DATA],
      value: ""
    },
    link: {
      type: [admin_table_field_types.TEXT],
      value: ""
    },
    img: {
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
    let newPromotion = { img: post.img, link: post.link };
    let newPromotionList = [...promotionList];
    newPromotionList = newPromotionList.map((promotion) => {
      return {
        img: promotion.img.value,
        link: promotion.link.value,
      };
    });
    newPromotionList.push(newPromotion);
    updatePromotionList(newPromotionList);
  }

  const handleUpdateRow = async (id, put) => {
    console.log("id", id);
    console.log("put", put);
    const newPromotionList = promotionList.map(promotion => {
      if (promotion.id.value === id) {
        return { img: put.img || promotion.img.value, link: put.link || promotion.link.value };
      }
      return {
        img: promotion.img.value,
        link: promotion.link.value,
      };
    });

    updatePromotionList(newPromotionList);
  }

  const handleDeleteRow = async (id) => {
    // let newPromotionList = promotionList.filter(promotion => promotion.id.value !== id);
    // newPromotionList = newPromotionList.map((promotion) => {
    //   return {
    //     img: promotion.img.value,
    //     link: promotion.link.value,
    //   };
    // });
    // updatePromotionList(newPromotionList);
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
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => console.log(promotionPreview)}
          >
            Full screen preview
          </button>
        </div>
        <PromotionSlider promotions={promotionPreview} handleNavigate={handleNavigate} />
      </div>
    </div>
  )
}

export default PromotionSetting;