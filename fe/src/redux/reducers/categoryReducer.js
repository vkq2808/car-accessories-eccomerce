import { CATEGORY_ACTION_TYPES } from '../actions/categoryActions';

const initialState = {
    list: [],
}

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case CATEGORY_ACTION_TYPES.SET_CATEGORIES:
            return {
                ...state,
                list: action.payload
            }
        case CATEGORY_ACTION_TYPES.ADD_CATEGORY:
            return {
                ...state,
                list: [...state.list, action.payload]
            }
        case CATEGORY_ACTION_TYPES.UPDATE_CATEGORY:
            return {
                ...state,
                list: state.list.map(category => category._id === action.payload._id ? action.payload : category)
            }
        case CATEGORY_ACTION_TYPES.DELETE_CATEGORY:
            return {
                ...state,
                list: state.list.filter(category => category._id !== action.payload)
            }
        default:
            return state;
    }
}

export default categoryReducer;
