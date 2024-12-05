import { AUTH_ACTION_TYPES } from "../actions/authActions";
import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
    token: localStorage.getItem('access_token'),
    user: null,
    redirecting: false,
    role: ''
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBALTYPES.AUTH:
            return {
                ...state,
                ...action.payload
            }
        case GLOBALTYPES.REDIRECTING:
            return {
                ...state,
                redirecting: action.payload
            }
        case AUTH_ACTION_TYPES.LOGOUT:
            return initialState
        default:
            return state
    }
}

export default authReducer