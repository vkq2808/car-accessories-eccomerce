import { useEffect, useState } from "react";
import Loading from "../../components/common/alert/Loading";
import { getDataAPI } from "../../utils/fetchData";
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../redux/action/globalTypes";
import { addProductToCart, CART_ACTION_TYPES } from "../../redux/action/cartAction";
import { formatNumberWithCommas } from "../../utils/stringProcess";

const ProductDetail = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const auth = useSelector(state => state.auth);
    const cart = useSelector(state => state.cart)

    const dispatch = useDispatch()
    const path = window.location.pathname.split('/').reverse()[0]

    useEffect(() => {
        setIsLoading(true)
        getDataAPI(`product/${path}`)
            .then(res => {
                setIsLoading(false)
                if (res.status === 200) {
                    setProduct(res.data.product)
                }
                else {
                    console.log(res)
                    dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.msg })
                }
            })
            .catch(err => {
                setIsLoading(false)
            })
    }, [path, dispatch])

    const CustomMarkdown = ({ children }) => {
        return (<ReactMarkdown
            className='markdown p-[20px] bg-[#f5f8fd] text-[#777] overflow-y-auto outline-none text-[1rem]'
            children={children}
            components={{
                img: ({ node, ...props }) => {
                    return (<img {...props} style={{ maxWidth: '100%' }} alt={props.alt} />)
                },
                h2: ({ node, ...props }) => {
                    return (<h2 {...props} style={{ color: '#4d0406', fontWeight: 700 }} children={props.children} />)
                },
                h3: ({ node, ...props }) => {
                    return (<h3 {...props} style={{ color: '#4d0406', fontWeight: 700 }} children={props.children} />)
                },
                li: ({ node, ...props }) => {
                    return (<li {...props} style={{ userSelect: 'all' }} />)
                },
                p: ({ node, ...props }) => {
                    return (<p {...props} style={{}} />)
                },
            }}
        />)
    }

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    const handleIncreaseQuantity = () => {
        if (quantity < product.quantity) {
            setQuantity(quantity + 1)
        }
    }

    const handleQuantityChange = (e) => {
        if (e.target.value === '') {
            setQuantity(1)
            return
        }
        const value = parseInt(e.target.value)
        if (value > product.quantity) {
            setQuantity(product.quantity)
        }
        else if (value < 1) {
            setQuantity(1)
        }
        else {
            setQuantity(value)
        }
    }

    const handleAddToCart = () => {
        if (auth?.token) {
            dispatch(addProductToCart(product, quantity, auth.token))
            localStorage.setItem('cart_items', JSON.stringify(cart.items))
            localStorage.setItem('cart_synced', true)
        } else {
            dispatch({ type: CART_ACTION_TYPES.ADD_TO_CART, payload: { product, quantity } })
            localStorage.setItem('cart_items', JSON.stringify([...cart.items, { product, quantity }]))
            localStorage.setItem('cart_synced', false)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center w-full">
            {
                (isLoading && <Loading />) ||
                (product &&
                    (<div className="flex w-full md:w-[80%]">
                        <div className="flex flex-col">
                            <div className="flex flex-col w-full py-4 md:flex-row">
                                <img className="w-full md:w-[50%] p-2" src={product.imageUrl} alt={product.name} />
                                <div className="flex flex-col p-2">
                                    <h2 className="select-all">{product.name}</h2>
                                    <h4 className="text-[#a50a08]">{formatNumberWithCommas(product.price)} {product.currency}</h4>
                                    <p>{formatNumberWithCommas(product.quantity)} sản phẩm có sẵn</p>

                                    <div className="flex flex-row items-center">
                                        <div className="decrease-button cursor-pointer" onClick={handleDecreaseQuantity}>
                                            <i className="fas fa-minus"></i>
                                        </div>
                                        <input className="quantity-input w-8 outline-0 border-none text-center" value={quantity} onChange={(e) => handleQuantityChange(e)} />
                                        <div className="increase-button cursor-pointer" onClick={handleIncreaseQuantity}>
                                            <i className="fas fa-plus"></i>
                                        </div>
                                    </div>
                                    <div className="actions flex justify-between">
                                        <button className="btn btn-primary w-[40%] min-w-[120px]">Mua ngay</button>
                                        <button className="btn btn-primary w-[40%] min-w-[120px]"
                                            onClick={handleAddToCart}
                                        >
                                            Thêm vào giỏ hàng
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-auto mr-auto px-2 bg-[#f5f8fd]"> Mô tả </div>
                            <CustomMarkdown children={product?.detail} />
                        </div>
                    </div>
                    )
                )
            }
        </div>
    )
}

export default ProductDetail;