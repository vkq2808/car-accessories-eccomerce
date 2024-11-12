import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
  theme: localStorage.getItem('theme') || 'light',  // Lấy theme từ localStorage nếu có
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.THEME:
      return {
        ...state,
        theme: !state.theme || state.theme === 'light' ? 'dark' : 'light',
      }
    default:
      return state
  }
}

export default settingsReducer;