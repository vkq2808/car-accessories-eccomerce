import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers/index';
import { setDispatch } from '../utils/fetchData';

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

const DataProvider = ({ children }) => {
    setDispatch(store.dispatch);
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

export default DataProvider;
