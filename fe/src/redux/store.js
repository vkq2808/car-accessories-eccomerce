import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers/index';

// Tạo store với state từ localStorage
const store = createStore(
    rootReducer,
    applyMiddleware(thunk) // Kết hợp middleware
);

const DataProvider = ({ children }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

export default DataProvider;
