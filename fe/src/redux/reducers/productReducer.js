import { PRODUCT_ACTION_TYPES } from "../actions/productActions";

const initalState = {
    list: [],
    following: [],
    newProducts: [],
    trendingProducts: [],
    searchResults: {
        products: [],
        total: 0
    }
}

const productReducer = (state = initalState, action) => {
    switch (action.type) {
        case PRODUCT_ACTION_TYPES.GET_PRODUCTS:
            return {
                ...state,
                list: action.payload
            }
        case PRODUCT_ACTION_TYPES.GET_NEW_PRODUCTS:
            return {
                ...state,
                newProducts: action.payload.map(product => {
                    return {
                        ...product,
                        is_hovering: false
                    }
                })
            }
        case PRODUCT_ACTION_TYPES.GET_TRENDING_PRODUCTS:
            return {
                ...state,
                trendingProducts: action.payload
            }
        case PRODUCT_ACTION_TYPES.SEARCH_PRODUCTS:
            return {
                ...state,
                searchResults: {
                    products: [...state.searchResults.products, ...action.payload.products],
                    total: action.payload.total
                }
            }
        case PRODUCT_ACTION_TYPES.CLEAR_SEARCH_PRODUCTS:
            return {
                ...state,
                searchResults: {
                    products: [],
                    total: 0
                }
            }
        case PRODUCT_ACTION_TYPES.FOLLOW_PRODUCT:
            return {
                ...state,
                following: [...state.following, action.payload]
            }
        case PRODUCT_ACTION_TYPES.UNFOLLOW_PRODUCT:
            return {
                ...state,
                following: state.following.filter(follow_product => follow_product.product.id !== action.payload.product.id)
            }
        case PRODUCT_ACTION_TYPES.GET_FOLLOWING_PRODUCTS:
            return {
                ...state,
                following: action.payload
            }
        case PRODUCT_ACTION_TYPES.GET_FOLLOWING_PRODUCTS_FROM_STORAGE:
            return {
                ...state,
                following: action.payload
            }
        case PRODUCT_ACTION_TYPES.INIT_FOLLOWING_PRODUCTS:
            return {
                ...state,
                following: []
            }

        default:
            return state;
    }
}
export default productReducer;