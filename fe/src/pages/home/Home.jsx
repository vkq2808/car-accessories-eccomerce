import React, { useEffect, useState } from 'react';
import './Home.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../redux/action/productAction';
import Helmet from 'react-helmet';

const Home = () => {
    const [categorySelected, setCategorySelected] = useState(null);
    const [isHoveringCategory, setIsHoveringCategory] = useState(false);
    const [isHoveringPanel, setIsHoveringPanel] = useState(false);
    const [isSmallDevice, setIsSmallDevice] = React.useState(false);
    const [cateSwiperItemCount, setCateSwiperItemCount] = React.useState(4);
    const [newProducts, setNewProducts] = useState([]);
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);

    const { products } = useSelector(state => state.products);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!products || products.length === 0) {
            dispatch(getProducts());
        }

        let newProductsUpdate = products
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // So sánh chính xác theo ngày
            .slice(0, 4); // Lấy 4 sản phẩm mới nhất
        setNewProducts(newProductsUpdate);
    }, [products, dispatch]);

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

    const categories = [
        {
            id: 1,
            name: "Phụ kiện hot",
            link: "/collections/phu-kien-do-choi-theo-xe",
            iconSrc: "https://file.hstatic.net/200000265255/file/hlvqhekrnqcqews3r-pjdg78hfaqq3bf_a2b4cf530ad34ad8864ab1128e33137c.png",
            subCategories: [
                {
                    name: "MÀN HÌNH ANDROID",
                    products: [
                        {
                            name: "Màn Hình Android Owince C970 Pro",
                            link: "/product/man-hinh-android-ownice-c970-pro",
                        }, {
                            name: "Màn Hình Android Xe Ô tô Winca",
                            link: "/product/man-hinh-android-xe-o-to-winca"
                        }, {
                            name: "Màn Hình DVD Android Ô tô Kia Cerato",
                            link: "/product/man-hinh-dvd-android-o-to-kia-cerato"
                        }, {
                            name: "Màn Hình Androi Cho Xe Ô tô Toyota Fotuner",
                            link: "/product/man-hinh-android-cho-xe-o-to-toyota-fortuner"
                        }
                    ]
                }, {
                    name: "PHIM CÁCH NHIỆT",
                    products: [
                        {
                            name: "Phim Cách Nhiệt Xe Ô tô 3M",
                            link: "/product/phim-cach-nhiet-xe-o-to-3m"
                        }, {
                            name: "Phim Cách Nhiệt Xe Ô tô Llumar",
                            link: "/product/phim-cach-nhiet-xe-o-to-llumar"
                        }, {
                            name: "Phim Cách Nhiệt Xe Ô tô Vkool",
                            link: "/product/phim-cach-nhiet-xe-o-to-vkool"
                        }
                    ]
                }, {
                    name: "BỌC GHẾ DA",
                    products: [
                        {
                            name: "Bọc Ghế Da Xe Ô tô",
                            link: "/product/boc-ghe-da-xe-o-to"
                        }, {
                            name: "Bọc Ghế Da Xe Ô tô Toyota",
                            link: "/product/boc-ghe-da-xe-o-to-toyota"
                        }, {
                            name: "Bọc Ghế Da Xe Ô tô Honda",
                            link: "/product/boc-ghe-da-xe-o-to-honda"
                        }
                    ]
                }, {
                    name: "CAMERA HÀNH TRÌNH",
                    products: [
                        {
                            name: "Camera Hành Trình Ô tô Xiaomi",
                            link: "/product/camera-hanh-trinh-o-to-xiaomi"
                        }, {
                            name: "Camera Hành Trình Ô tô Vietmap",
                            link: "/product/camera-hanh-trinh-o-to-vietmap"
                        }, {
                            name: "Camera Hành Trình Ô tô Junsun",
                            link: "/product/camera-hanh-trinh-o-to-junsun"
                        }
                    ]
                }
            ]
        }, {
            id: 2,
            name: "Phụ kiện - Đồ chơi Xe",
            link: "/collections/phu-kien-do-choi-theo-xe",
            imgSrc: "https://file.hstatic.net/200000317829/file/1200x790-5_2bf0c22bc71b4e05a3fdc9675a630993.png",
            iconSrc: "https://file.hstatic.net/200000265255/file/xo5k-ta6oi4cb9cm-xqcytnl6jjl9twu_1fbf86dc3f7d41d2ad8a5326d183ef19.png",
            subCategories: [
                {
                    name: "Nước hoa cho xe",
                    products: [
                        {
                            name: "Nước Hoa Xe GRASSE",
                            link: "/product/nuoc-hoa-xe-grasse"
                        }
                    ]
                }, {
                    name: "Body Kits",
                    products: [
                        {
                            name: "Body Kits Toyota Fortuner",
                            link: "/product/body-kits-toyota-fortuner"
                        }, {
                            name: "Body Kits Honda Civic",
                            link: "/product/body-kits-honda-civic"
                        }, {
                            name: "Body Kits Toyota Camry",
                            link: "/product/body-kits-toyota-camry"
                        }, {
                            name: "Body Kits Xpander",
                            link: "/product/body-kits-xpander"
                        }
                    ]
                }, {
                    name: "Cách Âm Xe Hơi",
                    products: [
                        {
                            name: "Cách Âm Xe Ô tô",
                            link: "/product/cach-am-xe-o-to"
                        }
                    ]
                }, {
                    name: "Cốp điện",
                    // Cốp Điện Perfect Car
                    // Độ Ty Cốp Điện Xe Ô Tô
                    products: [
                        {
                            name: "Cốp Điện Perfect Car",
                            link: "/product/cop-dien-perfect-car"
                        }, {
                            name: "Độ Ty Cốp Điện Xe Ô Tô",
                            link: "/product/do-ty-cop-dien-xe-o-to"
                        }
                    ]
                }
            ]
        }, {
            id: 3,
            name: "Màn hình Android Ô tô",
            link: "/collections/man-hinh-android-oto",
            imgSrc: "https://file.hstatic.net/200000317829/file/1200x790-1_8168758d1def49fab8149a4bfdaad88d.png",
            iconSrc: "https://file.hstatic.net/200000265255/file/dkzffakympllkpnc-cyefc1u1qh0iy_6_c6ef4a3de3654b51a8f7c05aebca2021.png",
            products: [
                {
                    name: "Màn hình Android Xe Ô tô Winca",
                    link: "/product/man-hinh-android-xe-o-to-winca"
                }
            ]
        }, {
            id: 4,
            name: "Phim cách nhiệt Ô tô",
            link: "/collections/phim-cach-nhiet-oto",
            imgSrc: "https://file.hstatic.net/200000317829/file/1200x790-3_fd8a9d37e3d54f7fb55781beed323b0e.png",
            iconSrc: "https://file.hstatic.net/200000265255/file/screenshot_24cdb019a18044f1a91520e68528d0a5.png",
        }, {
            id: 5,
            name: "Camera hành trình Ô tô",
            link: "/collections/camera-hanh-trinh-oto",
            imgSrc: "https://file.hstatic.net/200000317829/file/1200x790-1_8168758d1def49fab8149a4bfdaad88d.png",
            iconSrc: "https://file.hstatic.net/200000265255/file/e8-60mig4odup7dymtdmedcwee34sgnj_20ce2cc0540a49b7a2f72dac88d07317.png",
        }, {
            id: 6,
            name: "Bọc ghế Da Ô tô",
            link: "/collections/boc-ghe-da-oto",
            imgSrc: "https://file.hstatic.net/200000317829/file/1200x790-4_e3fc46fa192a4eae8111fcbc9384d134.png",
            iconSrc: "https://file.hstatic.net/200000265255/file/wpwvowtszoezflm7yqus_aakvajxdbgd_31d998fee8bb4c4e92ba3b68add6a18e.png",
        }, {
            id: 7,
            name: "Bọc đèn Ô tô",
            link: "/collections/boc-den-oto",
            imgSrc: "https://file.hstatic.net/200000317829/file/1200x790-4_e3fc46fa192a4eae8111fcbc9384d134.png",
            iconSrc: "https://file.hstatic.net/200000265255/file/xqntuskuqp8s_iorbjrin28exodh8lx7_8ba1b79ff47b4a40b6b02e84c31ad27f.png",
        }, {
            id: 8,
            name: "Phủ Ceramic",
            link: "/collections/phu-ceramic",
            iconSrc: "https://file.hstatic.net/200000265255/file/xqntuskuqp8s_iorbjrin28exodh8lx7_8ba1b79ff47b4a40b6b02e84c31ad27f.png",
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
            link: "collections/phu-kien-do-choi-theo-xe",
            imgSrc: "https://file.hstatic.net/200000317829/file/900x500_9f309779edfe4d3692354d124b2cf71c.png"
        }, {
            link: "collections/do-den-oto",
            imgSrc: "https://file.hstatic.net/200000317829/file/900x500-1_739ca159962d4209b1777724da12ddb6.png"
        }, {
            link: "collections/boc-ghe-da-oto",
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
                                            <img src={cate.iconSrc} alt={cate.name} className='w-[20px] h-[20px]' />
                                        </span>
                                        <div className='category-name pl-2'>{cate.name}</div>
                                    </div>
                                    {((cate?.subCategories && cate?.subCategories?.length > 0) || (cate?.products && cate?.products?.length)) && (
                                        <i className='lni lni-chevron-right' />
                                    )}
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
                                                    <div className="sub-category-products flex flex-col items-start">
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
                    <div className={`w-full slider-container block max-w-[1300px] p-2 px-10`}>
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
                <div className="w-[100vw] lg:w-[80vw] flex flex-col items-start justify-start">
                    <h2 className='underline-title m-2 w-full'>
                        SẢN PHẨM MỚI
                    </h2>
                    <div className="flex flex-row justify-between flex-wrap w-full p-2">
                        {newProducts && newProducts.map(product => (
                            <div key={product.id} className='product-card flex flex-col items-center'>
                                <div className='product-name text-center text-lg font-semibold '
                                >
                                    {product.name}
                                </div>
                                <div className='w-full flex justify-center items-center content-center'>
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className='w-auto h-full max-h-[152px] object-cover my-2 cursor-pointer'
                                    />
                                </div>
                                <div className="gradient-box cursor-pointer"
                                    onClick={() => handleNavigate(`/product/${product.path}`)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
export default Home;