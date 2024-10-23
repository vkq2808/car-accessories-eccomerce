import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
    token: '',
    user: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBALTYPES.AUTH:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user
            }
        default:
            return state
    }
}

export default authReducer