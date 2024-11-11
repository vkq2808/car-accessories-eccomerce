
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNewProducts } from '../../redux/actions/productActions';
import Helmet from 'react-helmet';
import { formatNumberWithCommas, maximizeString } from '../../utils/stringUtils';

const Home = () => {
    const [categorySelected, setCategorySelected] = useState(null);
    const [isHoveringCategory, setIsHoveringCategory] = useState(false);
    const [isHoveringPanel, setIsHoveringPanel] = useState(false);
    const [isSmallDevice, setIsSmallDevice] = React.useState(false);
    const [cateSwiperItemCount, setCateSwiperItemCount] = React.useState(4);
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);

    const newProducts = useSelector(state => state.product.newProducts);
    const categories = useSelector(state => state.category.list);
    const [hoveringNewProducts, setHoveringNewProducts] = useState(Array(newProducts.length).fill(false));

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getNewProducts());
    }, [dispatch]);


    const policies = [
        {
            imgSrc: "https://file.hstatic.net/200000265255/file/static-icons-3_bf2d3625ab414276a01c726228fd46c0.png",
            title: "Tư Vấn Miễn Phí",
            content: "Nhận tư vấn từ chuyên gia 24/7"
        }, {
            imgSrc: "https://file.hstatic.net/200000265255/file/static-icons-2_527e480eb3f6439d9c5fe19bc5e9a31f.png",
            title: "Hỗ Trợ Lắp Đặt",
            content: "Lắp đặt miễn phí tại TP.HCM"
        }, {
            imgSrc: "https://file.hstatic.net/200000317829/file/thiet_ke_khong_ten__25__2af7019e329a4716acf51eba534e66df.png",
            title: "Bảo Hành Chính Hãng",
            content: "Sản Phẩm, Phụ Kiện Chất Lượng Cao"
        }, {
            imgSrc: "https://file.hstatic.net/200000265255/file/static-icons-4_506ec194d9444d30925aaa929ae0e2b3.png",
            title: "Thanh Toán An Toàn",
            content: "Chính sách hậu mãi uy tín"
        }
    ]

    const filteredCategories = categories.filter(x => x.imgSrc && x.imgSrc.trim() !== "")

    const sliderBanners = [
        {
            id: 1,
            image: 'https://file.hstatic.net/200000317829/file/1920x760-1_d3d9fccab54d4f55ab0d29832636827c.png',
            alt: 'Giảm giá mùa hè 50%',
            link: '/promotion1',
            smallDeviceImage: 'https://file.hstatic.net/200000317829/file/600x700-1_095e2bf774764045ab3ce8c228b3a803.png',
        },
        {
            id: 2,
            image: 'https://file.hstatic.net/200000317829/file/1920x760_ee544232a6f9431eb8ea916de1104cf1.png',
            alt: 'Sản phẩm mới nhất',
            link: '/promotion2',
            smallDeviceImage: 'https://file.hstatic.net/200000317829/file/600x700-2_775a287a437f48769de6b6037674dc64.png'
        },
        {
            id: 3,
            image: 'https://file.hstatic.net/200000317829/file/1920x760-2_d3e17f4a0c27445b9b7209a74daa6691.png',
            alt: 'Ưu đãi đặc biệt',
            link: '/promotion3',
            smallDeviceImage: 'https://file.hstatic.net/200000317829/file/600x700_528ffec18ea74b4786039ba95f79c937.png'
        },
        // Thêm các banner khác tại đây
    ];

    const banners = [
        {
            link: "search/q?category_id=-1",
            imgSrc: "https://file.hstatic.net/200000317829/file/900x500_9f309779edfe4d3692354d124b2cf71c.png"
        }, {
            link: "search/q?category_id=10",
            imgSrc: "https://file.hstatic.net/200000317829/file/900x500-1_739ca159962d4209b1777724da12ddb6.png"
        }, {
            link: "search/q?category_id=3",
            imgSrc: "https://file.hstatic.net/200000317829/file/900x500-2_cc1b0d6234264862bfbb05a7d7b12428.png"
        }
    ]

    const swiperRef = React.useRef(null);

    const handleNavigate = (link) => {
        navigate(link);
    }

    const handleNext = () => {
        if (swiperRef.current) {
            swiperRef.current.swiper.slideNext();
        }
    }

    const handlePrev = () => {
        if (swiperRef.current) {
            swiperRef.current.swiper.slidePrev();
        }
    }

    useEffect(() => {
        if (!isHoveringCategory && !isHoveringPanel) {
            setCategorySelected(null);
        }
    }, [isHoveringCategory, isHoveringPanel]);

    const onCategoryMouseEnter = (cate) => {
        if ((cate.subCategories && cate.subCategories?.length > 0) || (cate?.products && cate?.products?.length)) {
            setCategorySelected(cate);
            setIsHoveringCategory(true);
        }
    }

    window.addEventListener('resize', () => {
        setDeviceWidth(window.innerWidth);
        if (deviceWidth <= 768) {
            setIsSmallDevice(true);
            setCateSwiperItemCount(2);
        } else if (deviceWidth <= 1424) {
            setIsSmallDevice(true);
            setCateSwiperItemCount(3);
        }
        else {
            setIsSmallDevice(false);
            setCateSwiperItemCount(4);
        }
    });

    const handleMouseEnterNewProduct = (index) => {
        setHoveringNewProducts((prevHovering) => {
            const newHoveringNewProducts = new Array(prevHovering.length).fill(false);

            if (index >= 0) {
                newHoveringNewProducts[index] = true;
            }

            return newHoveringNewProducts;
        });

    }


    return (
        <>
            <Helmet>
                <title>UTE Gara - Trang chủ</title>
                <meta name="description" content="UTE Gara - Trang chủ" />
            </Helmet>

            <div className='home flex flex-col items-center justify-center h-auto w-[100vw] lg:w-[80vw]'>
                {/* Category Title and Banner */}
                <div className="category-slider-container body-content flex flex-row items-start w-[100vw] lg:w-[80vw] h-full">
                    <div className="menu-category-container flex flex-col w-[20%]">
                        <div className='category-title flex flex-row items-center p-2 bg-black text-[--yellow-color]'>
                            <i className='lni lni-menu' />
                            <div className="title font-semibold pl-4">Danh Mục Sản Phẩm</div>
                        </div>
                        <div className="category-list flex flex-col items-start">
                            {categories.map(cate => (
                                <div key={cate.id} className={`category-item flex flex-row items-center jusify-between h-auto w-full `
                                    + `${cate.id === categorySelected?.id ? +"bg-[#ffffff]" : "bg-[--cate-bg-color]"} `
                                    + `text-black cursor-pointer`}
                                    onMouseEnter={() => onCategoryMouseEnter(cate)}
                                    onMouseLeave={() => setIsHoveringCategory(false)}
                                >
                                    <div className='flex flex-row  w-full items-center h-[45px] '>
                                        <span className='category-icon pl-2'>
                                            <img src={cate.image_url} alt={cate.name} className='w-[35px] h-[35px]' />
                                        </span>
                                        <div className='category-name pl-2'>{cate.name}</div>
                                    </div>
                                    {(cate?.products && cate?.products?.length && (
                                        <i className='lni lni-chevron-right' />
                                    )) || (<i></i>)}
                                </div>

                            ))}
                        </div>
                    </div>
                    <div className={`slider-container flex w-[80%] h-full`}>
                        {!categorySelected &&
                            <div className='h-full w-full bg-black'>
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                                    slidesPerView={1}
                                    navigation={{ nextEl: '.swiper-button-next-panel-slider', prevEl: '.swiper-button-prev-panel-slider' }}
                                    pagination={{ clickable: true }}
                                    autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                                    loop
                                    effect="cube"
                                    className="mySwiper"
                                >
                                    {sliderBanners.map(banner => (
                                        <SwiperSlide key={banner.id} className='flex justify-center items-center'>
                                            <a href={banner.link} className='w-full flex justify-center items-center content-center'>
                                                <img
                                                    src={isSmallDevice ? banner.smallDeviceImage : banner.image}
                                                    alt={banner.alt}
                                                    className={` h-full w-auto max-h-[400px] object-cover`}
                                                    z-index={1}
                                                />
                                            </a>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>}
                        <div className="category-panel h-[400px] w-full z-8 flex flex-row flex-wrap bg-slate-200"
                            onMouseEnter={() => setIsHoveringPanel(true)}
                            onMouseLeave={() => setIsHoveringPanel(false)}
                        >
                            {categorySelected && (
                                ( // Render sub-categories or products
                                    categorySelected.subCategories && (
                                        categorySelected.subCategories?.map(
                                            subCate => (
                                                <div key={subCate.name} className="sub-category flex flex-col items-start pl-3 pr-6">
                                                    <div className="sub-category-title w-full bg-slate-500 text-[--yellow-color] px-2 py-1">
                                                        {subCate.name}
                                                    </div>
                                                    <div className="sub-category-products flex flex-col items-start overflow-auto">
                                                        {subCate.products.map(product => (
                                                            <div
                                                                key={product.name}
                                                                className="w-full product-name px-2 py-1 bg-slate-300 cursor-pointer hover:bg-[#ffffff]"
                                                                onClick={() => handleNavigate(product.link)}>
                                                                {product.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        )
                                    )
                                ) || (
                                    categorySelected.products?.map(
                                        product => (
                                            <div key={product.name} className="h-fit product-name px-2 py-1 bg-slate-300 cursor-pointer hover:bg-[#ffffff]"
                                                onClick={() => handleNavigate(product.link)}>
                                                {product.name}
                                            </div>
                                        )
                                    )
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* POLICIES */}
                <div className="policy-container w-[100vw] lg:w-[80vw] flex flex-row justify-between flex-wrap pt-10 px-5">
                    {policies.map(policy => (
                        <div key={policy.title} className="policy-card flex flex-col items-center mx-4">
                            <img src={policy.imgSrc} alt={policy.title} />
                            <div>
                                <div className='title'>{policy.title}</div>
                                <div className='content'>{policy.content}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* BANNER  */}
                <div className="banner-container flex flex-row justify-between flex-wrap w-[100vw] lg:w-[80vw] p-2">
                    {banners.map(banner => (
                        <div onClick={() => handleNavigate(banner.link)} key={banner.link} className='banner-card cursor-pointer' >
                            <a href={banner.link} className="banner-content">
                                <img src={banner.imgSrc} alt="banner" className='w-auto h-[190px] my-3 mx-2' />
                            </a>
                            <div className="gradient-box" />
                        </div>
                    ))}
                </div>
                {/* CATEGORIES AND SERVICES*/}
                <div id="categories-and-services-container"
                    className="flex flex-col w-[100vw] lg:w-[80vw] bg-white">
                    <h2 className='underline-title m-2 w-full'>
                        DANH MỤC SẢN PHẨM VÀ DỊCH VỤ
                    </h2>
                    <div className={`slider-container block w-[100vw] lg:w-[80vw] p-2 px-10`}>
                        <Swiper
                            modules={[Navigation, Pagination, EffectFade]}
                            slidesPerView={cateSwiperItemCount}
                            navigation={{ nextEl: '.swiper-button-next-category-slider', prevEl: '.swiper-button-prev-category-slider' }}
                            pagination={{ clickable: true }}
                            effect='cube'
                            loop={true}
                            ref={swiperRef}
                            className='cate-slider'
                        >
                            {filteredCategories.concat(filteredCategories).map((cate, index) => (
                                <SwiperSlide key={"cate-slider-" + index} className='cate-card flex flex-col items-center'
                                    onClick={() => navigate(cate.link)}>
                                    <div className='cate-name text-center text-lg font-semibold'>{cate.name}</div>
                                    <div className='w-full flex justify-center items-center content-center'>
                                        <img
                                            src={cate.imgSrc}
                                            alt={cate.name}
                                            className='w-auto h-full max-h-[152px] object-cover'
                                        />
                                    </div>
                                    <div className="gradient-box" />
                                </SwiperSlide>
                            ))}
                            <div className="btn swiper-button-prev-category-slider" onClick={handlePrev} ><i className="fa-solid fa-chevron-left"></i></div>
                            <div className="btn swiper-button-next-category-slider" onClick={handleNext} ><i className="fa-solid fa-chevron-right"></i></div>
                        </Swiper>
                    </div>
                </div>
                {/* SẢN PHẨM MỚI */}
                <div className="w-[100vw] lg:w-[80vw] flex flex-col items-center justify-center">
                    <h2 className='underline-title m-2 w-full'>
                        SẢN PHẨM MỚI
                    </h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-5'>
                        {newProducts.map((product, index) => (
                            <div
                                key={product.id}
                                className={'h-[328px] w-[342px] bg-white m-[0.75rem] shadow-md flex flex-col cursor-pointer items-center ' +
                                    (index === 6 || index === 7 ? ' md:hidden lg:flex' : '')}
                                onClick={() => navigate(`/product/${product.path}`)}
                                onMouseEnter={() => handleMouseEnterNewProduct(index)}
                                onMouseLeave={() => handleMouseEnterNewProduct(-1)}
                            >
                                <motion.div
                                    className={`flex h-[200px] w-full items-center justify-center transition ease-in ${hoveringNewProducts[index] ? '' : 'p-[20px]'}`}
                                    initial={{ opacity: 1 }} // Trạng thái ban đầu
                                    animate={{ opacity: hoveringNewProducts[index] ? 0.8 : 1 }} // Giảm độ trong suốt khi hover
                                    transition={{ duration: 0.4 }} // Thời gian animation
                                >
                                    <motion.img
                                        initial={{ scale: 1 }} // Trạng thái ban đầu
                                        animate={{ scale: hoveringNewProducts[index] ? 1.03 : 1 }}
                                        transition={{ duration: 0.4 }}

                                        loading='lazy'
                                        src={product.image_url}
                                        alt={maximizeString(product.name, 20)}
                                        className={`w-full h-[200px] object-cover`}
                                    />
                                </motion.div>
                                <motion.div
                                    className='flex flex-col justify-center w-[282px]'

                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: hoveringNewProducts[index] ? 0.8 : 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <h1 className='text-lg font-semibold mt-2'>{maximizeString(product.name, 45)}</h1>
                                    <p className='text-lg font-semibold mt-2'>{formatNumberWithCommas(product.price)} {product.currency}</p>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
export default Home;