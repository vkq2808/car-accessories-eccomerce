import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import Toast from "./Toast";
import { GLOBALTYPES } from "../../../redux/action/globalTypes";

const Alert = () => {
    const { alert } = useSelector((state) => state)
    const dispatch = useDispatch()
    return (
        <div>
            {alert.loading && <Loading />}

            {alert.error && (
                <Toast
                    msg={{ title: "Ôi không!", body: alert.error }}
                    handleShow={() => dispatch({ type: GLOBALTYPES.RESET_ALERT })}
                    icon="fa-solid fa-circle-xmark"
                    textColor="text-danger"
                />
            )}

            {alert.success && (
                <Toast
                    msg={{ title: "Thành công!", body: alert.success }}
                    handleShow={() => dispatch({ type: GLOBALTYPES.RESET_ALERT })}
                    icon="fa-solid fa-check"
                    textColor="text-success"
                />
            )}

            {alert.notify && (
                <Toast
                    msg={{ title: "Bạn có một thông báo mới!", body: alert.notify }}
                    handleShow={() => dispatch({ type: GLOBALTYPES.RESET_ALERT })}
                    icon="fa-solid fa-bell"
                    textColor="text-primary"
                />
            )}
        </div>
    )
}

export default Alert