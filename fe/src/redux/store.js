import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers/index';

// Middleware lưu state vào localStorage
const saveToLocalStorage = store => next => action => {
    const result = next(action); // Thực hiện action trước
    try {
        const currentState = store.getState();
        const filteredState = {
            cart: currentState.cart,
            product: currentState.product,
            category: currentState.category,
        }
        const serializedState = JSON.stringify(filteredState);
        localStorage.setItem('reduxState', serializedState); // Lưu state vào localStorage
    } catch (error) {
        console.error('Could not save state to localStorage:', error);
    }
    return result;
};


// Tạo store với state từ localStorage
const store = createStore(
    rootReducer,
    applyMiddleware(thunk, saveToLocalStorage) // Kết hợp middleware
);

const DataProvider = ({ children }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

export default DataProvider;
