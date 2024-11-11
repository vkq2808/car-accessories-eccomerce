import { CART_ACTION_TYPES } from '../actions/cartActions';
import { ORDER_ACTION_TYPES } from '../actions/orderActions';

const initialState = localStorage.getItem('cart')
    ? { ...JSON.parse(localStorage.getItem('cart')), id: null }
    : {
        cart_items: [],
        deleted_items: [],
        id: null,
        createdAt: new Date().toISOString(),
    };

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case CART_ACTION_TYPES.ADD_TO_CART:
            return {
                ...state,
                cart_items: [...state.cart_items, action.payload],
            };

        case CART_ACTION_TYPES.CLEAR_CART:
            return {
                ...initialState,
                createdAt: new Date().toISOString(),
            };

        case CART_ACTION_TYPES.GET_CART:
            return {
                ...state,
                ...action.payload,
            };

        case CART_ACTION_TYPES.UPDATE_CART:
            return {
                ...state,
                cart_items: action.payload.cart_items || state.cart_items,
                deleted_items: action.payload.deleted_items || state.deleted_items,
            };

        case CART_ACTION_TYPES.UPDATE_CART_ITEM: {
            const { cart_item, quantity, product_option: oldOption, new_product_option: newOption } = action.payload;
            const updatedCartItems = state.cart_items.map(item =>
                item.product.id === cart_item.product.id && item.product_option.id === oldOption.id
                    ? { ...item, quantity, product_option: newOption || oldOption }
                    : item
            );

            if (newOption) {
                let duplicate = updatedCartItems.find(item => item.product.id === cart_item.product.id && item.product_option.id === newOption.id);
                if (duplicate) {
                    duplicate.quantity += quantity;
                    return {
                        ...state,
                        cart_items: updatedCartItems.filter(item => item.product_option.id !== oldOption.id),
                    };
                }
            }

            return {
                ...state,
                cart_items: updatedCartItems,
            };
        }

        case CART_ACTION_TYPES.REMOVE_CART_ITEM: {
            const { cart_item } = action.payload;
            let newCartItems = state.cart_items.filter(item => item.product.id !== cart_item.product.id || item.product_option.id !== cart_item.product_option.id);
            let found = state.deleted_items.some(item => item.product.id === cart_item.product.id && item.product_option.id === cart_item.product_option.id);
            let newDeletedItems = [...state.deleted_items];
            if (found) {
                newDeletedItems = newDeletedItems.map(item => item.product.id === cart_item.product.id && item.product_option.id === cart_item.product_option.id ? { ...item, quantity: item.quantity + cart_item.quantity } : item);
            } else {
                newDeletedItems.push(cart_item);
            }

            return {
                ...state,
                cart_items: newCartItems,
                deleted_items: newDeletedItems,
            };
        }


        case CART_ACTION_TYPES.RETRIEVE_CART_ITEM: {
            const { cart_item } = action.payload;
            let newDeletedItems = state.deleted_items.filter(item => item.product.id !== cart_item.product.id || item.product_option.id !== cart_item.product_option.id);
            let found = state.cart_items.some(item => item.product.id === cart_item.product.id && item.product_option.id === cart_item.product_option.id);
            let newCartItems = [...state.cart_items];
            if (found) {
                // if (token)
                newCartItems = newCartItems.map(item => item.product.id === cart_item.product.id && item.product_option.id === cart_item.product_option.id ? { ...item, quantity: item.quantity + cart_item.quantity } : item);
            } else {
                newCartItems.push(cart_item);
            }

            return {
                ...state,
                cart_items: newCartItems,
                deleted_items: newDeletedItems,
            };
        }

        case ORDER_ACTION_TYPES.FINISH_ORDER:
            return action.payload.is_cart ? initialState : state;

        default:
            return state;
    }
};

export default cartReducer;
