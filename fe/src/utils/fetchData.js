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

        if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    console.log('no refresh token');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    return Promise.reject(error);
                }

                const response = await axios.post(`${server_url}/auth/refresh-token`, { refreshToken });

                if (response.status !== 200) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    return Promise.reject(error);
                }

                const newToken = response.data.token;
                localStorage.setItem('accessToken', `Bearer ${newToken}`);

                // Sử dụng dispatch để cập nhật token vào Redux
                if (dispatch) {
                    dispatch(updateToken(newToken));
                }

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                return axiosInstance(originalRequest);
            } catch (err) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

// Các hàm API để gọi GET, POST, PUT, PATCH, DELETE
export const getDataAPI = async (url) => {
    const token = localStorage.getItem('accessToken');
    const res = await axiosInstance.get(url, {
        headers: { Authorization: token }
    });
    return res;
};

export const postDataAPI = async (url, post) => {
    const token = localStorage.getItem('accessToken');
    const res = await axiosInstance.post(url, post, {
        headers: { Authorization: token }
    });
    return res;
};

export const putDataAPI = async (url, put) => {
    const token = localStorage.getItem('accessToken');
    const res = await axiosInstance.put(url, put, {
        headers: { Authorization: token }
    });
    return res;
};

export const patchDataAPI = async (url, patch) => {
    const token = localStorage.getItem('accessToken');
    const res = await axiosInstance.patch(url, patch, {
        headers: { Authorization: token }
    });
    return res;
};

export const deleteDataAPI = async (url) => {
    const token = localStorage.getItem('accessToken');
    const res = await axiosInstance.delete(url, {
        headers: { Authorization: token }
    });
    return res;
};

export default axiosInstance;
