export const GLOBALTYPES = {
    AUTH: "AUTH",
    ERROR_ALERT: "ERROR_ALERT",
    SUCCESS_ALERT: "SUCCESS_ALERT",
    NOTIFY_ALERT: "NOTIFY_ALERT",
    LOADING: "LOADING",
    RESET_ALERT: "RESET_ALERT",
    THEME: "THEME",
    STATUS: 'STATUS',
    MODAL: "MODAL",
    USER_ROLE: "USER_ROLE",
    SOCKET: "SOCKET",
}

export const EditData = (data, id, newItem) => {
    const newData = data.map((item) => (item.id === id ? newItem : item))
    return newData
}

export const DeleteData = (data, id) => {
    const newData = data.filter((item) => item.id !== id)
    return newData
}