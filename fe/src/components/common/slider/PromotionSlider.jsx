import { Autoplay, EffectFade, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { imgSrc } from "../../../utils/imgSrc";

const PromotionSlider = ({ promotions, handleNavigate }) => {

  return (
    <div className="slider-part select-none ">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={50}
        slidesPerView={1}
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        className="promotion-slider"
      >
        {promotions?.map((promotion, index) => (
          <SwiperSlide key={index} className="duration-500">
            <div className=" flex lg:h-[600px] relative w-full">
              <div className="promotion-detail flex flex-col sticky w-full">
                <div className="pl-[100px] pt-[60px] absolute">
                  <h4 className="text-[--secondary-text-color] opacity-65">Best Furniture For Your Car....</h4>
                  <div className="text-[--primary-text-color] text-[53px] font-sans max-w-[700px]">New Car Furniture Collection
                    Trends in 2024</div>
                  <div className="view-detail-button"
                    onClick={() => handleNavigate(promotion?.link)}
                  >
                    <button className="bg-[#AAAAAA] cursor-pointer border-none rounded-[4px] hover:bg-blue-500 text-white px-4 py-2 mt-4">View Detail</button>
                  </div>
                </div>
                <div className="spacer h-[100px]">&nbsp;</div>
                <img className="w-full lg:w-2/3 h-auto object-contain transform translate-x-[50%]" src={imgSrc(promotion.image_url)} alt="promotion" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default PromotionSlider;