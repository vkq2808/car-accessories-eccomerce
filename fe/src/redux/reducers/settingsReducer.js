import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
  theme: localStorage.getItem('theme') || 'light',  // Lấy theme từ localStorage nếu có
  serverError: false,
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.THEME:
      return {
        ...state,
        theme: !state.theme || state.theme === 'light' ? 'dark' : 'light',
      }
    case GLOBALTYPES.SERVER_ERROR:
      return {
        ...state,
        serverError: action.payload
      }
    default:
      return state
  }
}

export default settingsReducer;