import axios from 'axios'
const server_url = process.env.REACT_APP_API_URL

export const getDataAPI = async (url, token) => {

    const res = await axios.get(`${server_url}/${url}`, {
        headers: { Authorization: token }
    })
    return res
}

export const postDataAPI = async (url, post, token) => {
    const res = await axios.post(`${server_url}/${url}`, post, {
        headers: { Authorization: token }
    })
    return res
}

export const putDataAPI = async (url, put, token) => {
    const res = await axios.put(`${server_url}/${url}`, put, {
        headers: { Authorization: token }
    })
    return res
}

export const patchDataAPI = async (url, patch, token) => {
    const res = await axios.patch(`${server_url}/${url}`, patch, {
        headers: { Authorization: token }
    })
    return res
}

export const deleteDataAPI = async (url, token) => {
    const res = await axios.delete(`${server_url}/${url}`, {
        headers: { Authorization: token }
    })
    return res
}