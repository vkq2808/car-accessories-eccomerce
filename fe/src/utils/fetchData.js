import axios from 'axios';
import { updateToken } from '../redux/actions/authActions'; // Action để cập nhật token vào Redux

// Khai báo biến `dispatch` để lưu `dispatch` của Redux
let dispatch;

// Hàm setDispatch để inject `dispatch` từ Redux vào file này
export const setDispatch = (d) => {
    dispatch = d;
};

const server_url = process.env.REACT_APP_API_URL;
const axiosInstance = axios.create({
    baseURL: server_url,
});

// Thiết lập interceptor cho axiosInstance để xử lý lỗi 401 và refresh token tự động
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if ((error.response.status === 401) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refresh_token = localStorage.getItem('refresh_token');
                if (!refresh_token) {
                    return Promise.reject(error);
                }

                const response = await axios.post(`${server_url}/auth/refresh-token`, { refresh_token });

                if (response.status !== 200) {
                    return Promise.reject(error);
                }

                const newToken = response.data.token;
                localStorage.setItem('access_token', `Bearer ${newToken}`);
                localStorage.setItem('refresh_token', `Bearer ${response.data.refresh_token}`);

                // Sử dụng dispatch để cập nhật token vào Redux
                if (dispatch) {
                    dispatch(updateToken(newToken));
                }

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                return axiosInstance(originalRequest);
            } catch (err) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

// Các hàm API để gọi GET, POST, PUT, PATCH, DELETE
export const getDataAPI = async (url) => {
    const token = localStorage.getItem('access_token');
    const res = await axiosInstance.get(url, {
        headers: { Authorization: token }
    });
    return res;
};

export const postDataAPI = async (url, post, options) => {
    const token = localStorage.getItem('access_token');
    const res = await axiosInstance.post(url, post, {
        ...options,
        headers: { Authorization: token }
    });
    return res;
};

export const putDataAPI = async (url, put) => {
    const token = localStorage.getItem('access_token');
    const res = await axiosInstance.put(url, put, {
        headers: { Authorization: token }
    });
    return res;
};

export const patchDataAPI = async (url, patch) => {
    const token = localStorage.getItem('access_token');
    const res = await axiosInstance.patch(url, patch, {
        headers: { Authorization: token }
    });
    return res;
};

export const deleteDataAPI = async (url) => {
    const token = localStorage.getItem('access_token');
    const res = await axiosInstance.delete(url, {
        headers: { Authorization: token }
    });
    return res;
};

export const fetchPublicKey = async () => {
    const response = await axiosInstance.get('/auth/public-key');
    return response.data.publicKey;
}

export default axiosInstance;
