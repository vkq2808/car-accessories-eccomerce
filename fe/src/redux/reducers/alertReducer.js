import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
    loading: false,
    error: null,
    success: null,
    notify: null
}

const alertReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBALTYPES.ERROR_ALERT:
            return {
                ...state,
                success: null,
                error: action.payload,
                notify: null
            }

        case GLOBALTYPES.SUCCESS_ALERT:
            return {
                ...state,
                error: null,
                success: action.payload,
                notify: null
            }

        case GLOBALTYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            }

        case GLOBALTYPES.RESET_ALERT:
            return {
                ...state,
                error: null,
                success: null,
                notify: null
            }

        case GLOBALTYPES.NOTIFY_ALERT:
            return {
                ...state,
                error: null,
                success: null,
                notify: action.payload
            }

        default:
            return state
    }
}

export default alertReducer