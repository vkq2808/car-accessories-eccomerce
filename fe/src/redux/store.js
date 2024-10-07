import { legacy_createStore as createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { thunk } from "redux-thunk"

import combineReducers from './reducer/index'

const store = createStore(combineReducers, applyMiddleware(thunk))

const DataProvider = ({ children }) => {
    // Đồng bộ trạng thái Redux vào localStorage
    store.subscribe(() => {
        localStorage.setItem('reduxState', JSON.stringify(store.getState()));
    });

    // Trong mỗi tab, lắng nghe sự thay đổi của localStorage
    window.addEventListener('storage', (event) => {
        if (event.key === 'reduxState') {
            const newState = JSON.parse(event.newValue);
            store.dispatch({ type: 'SET_STATE_FROM_STORAGE', payload: newState });
        }
    });

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default DataProvider