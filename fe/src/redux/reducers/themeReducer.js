import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
  theme: localStorage.getItem('theme') || 'light',  // Lấy theme từ localStorage nếu có
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.THEME:
      return {
        ...state,
        theme: action.payload
      }
    default:
      return state
  }
}

export default themeReducer;