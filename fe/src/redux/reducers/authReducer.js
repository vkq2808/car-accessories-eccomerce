import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
    token: '',
    user: null,
    redirecting: false
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBALTYPES.AUTH:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user
            }
        case GLOBALTYPES.REDIRECTING:
            return {
                ...state,
                redirecting: action.payload
            }
        case GLOBALTYPES.LOGOUT:
            return initialState
        default:
            return state
    }
}

export default authReducer