import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getNewProducts, getProductsBycategory_id, getTrendingProducts, PRODUCT_ACTION_TYPES } from "../../redux/actions/productActions";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCard from "../../components/common/card/ProductCard";
import { Helmet } from "react-helmet";
import { AnimatePresence } from "framer-motion";
import { getDataAPI } from "../../utils/fetchData";
import { Policies, PromotionSlider } from "../../components";

const NewHome = () => {
  const searchResults = useSelector((state) => state.product.searchResults);
  const categories = useSelector((state) => state.category.list);
  const trendingProducts = useSelector((state) => state.product.trendingProducts);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activecategory_id, setActivecategory_id] = React.useState(1);
  const [policies, setPolicies] = React.useState([]);
  const [promotions, setPromotions] = React.useState([]);

  const handleNavigate = (link) => {
    navigate(link);
  }

  useEffect(() => {
    dispatch({ type: PRODUCT_ACTION_TYPES.CLEAR_SEARCH_PRODUCTS });
    dispatch(getProductsBycategory_id({ category_id: activecategory_id }));
  }, [dispatch, activecategory_id]);

  useEffect(() => {
    dispatch(getNewProducts());
    dispatch(getTrendingProducts());

    const fetchPolicies = async () => {
      try {
        const response = await getDataAPI('public/get-policies');
        setPolicies(response.data.policies);
      } catch (err) {
        console.log(err);
      }
    }

    const fetchPromotions = async () => {
      try {
        const response = await getDataAPI('public/get-promotions');
        console.log(response.data);
        setPromotions(response.data.promotions);
      } catch (err) {
        console.log(err);
      }
    }

    fetchPolicies();
    fetchPromotions();
  }, [dispatch]);


  return (
    <div className="flex w-full flex-col bg-[--primary-background-color] text-[--primary-text-color]">
      <Helmet>
        <title>Phụ Tùng Xe Hơi - Trang Chủ</title>
        <meta name="description" content="Khám phá các sản phẩm phụ tùng xe hơi mới nhất, các sản phẩm nổi bật và xu hướng năm 2024. Chúng tôi cung cấp phụ tùng chính hãng, lắp đặt miễn phí tại TP.HCM." />
        <meta name="keywords" content="phụ tùng xe hơi, đồ nội thất xe hơi, phụ kiện ô tô, sản phẩm xe hơi, xu hướng nội thất xe hơi 2024" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.example.com" />
        <meta property="og:title" content="Phụ Tùng Xe Hơi - Trang Chủ" />
        <meta property="og:description" content="Khám phá các sản phẩm phụ tùng xe hơi mới nhất và các sản phẩm nổi bật năm 2024. Chúng tôi cung cấp các sản phẩm chính hãng và dịch vụ hỗ trợ tốt nhất." />
        <meta property="og:image" content="https://www.example.com/path/to/image.jpg" />
        <meta property="og:url" content="https://www.example.com" />
        <meta property="og:type" content="website" />
      </Helmet>
      <PromotionSlider promotions={promotions} handleNavigate={handleNavigate} />
      <div className="trending-products-container flex flex-col items-center w-full pt-10">
        <h2 className="text-2xl font-bold mb-5">Trending Products</h2>
        <div className="swiper-container flex justify-center w-full">
          <div className="slider-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 cursor-default select-none"
          >
            {trendingProducts.length > 0 && trendingProducts.map((product, index) => (
              <ProductCard className={`mr-6 hover:scale-[1.2] duration-500 ${index === 3 ? 'lg:hidden 2xl:flex' : ''}`} key={index} product={product} />
            ))
            }
          </div>
        </div>
      </div>
      <div className="products-by-categories flex flex-col w-full items-center mt-10">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="categories-container flex flex-wrap px-32">
          {categories.length > 0 && categories.map((category, index) => (
            <div className={`category-card hover:scale-[1.2] duration-500 flex flex-col items-center justify-center px-2 mr-3 pr-5 
            ${activecategory_id === category.id ? 'bg-[#63c9f5] text-[#000000] border-none rounded-lg select-none' : 'hover:bg-[#222] hover:text-[white] hover:rounded-lg cursor-pointer'}`}
              onClick={() => setActivecategory_id(category.id)} key={index}>
              <div className="category-name text-lg font-thin">
                {category.name}
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-full justify-end px-32 mt-10 mb-4">
          <div className="text-end rounded-xl py-2 px-4 duration-500 bg-[--secondary-background-color] hover:bg-[--tertiary-background-color] cursor-pointer">Xem tất cả</div>
        </div>
        <div className="products-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4">

          {searchResults.products.length > 0 && searchResults.products.map((product, index) => (
            <ProductCard className={`mr-6 hover:scale-[1.1] duration-500 ease-in-out`} key={index} product={product} />
          ))}
        </div>
        {searchResults.products.length === 0 && (<div className="flex justify-center w-full mt-10">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, x: 10000 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10000 }}
              className="flex flex-col w-full items-center justify-center">
              <h1 className="text-2xl font-bold">No products found</h1>
              <h4 className="text-lg">Please try again later</h4>
            </motion.div>
          </AnimatePresence>
        </div>
        )}
      </div>
      <Policies policies={policies} />
    </div >
  );
}

export default NewHome;