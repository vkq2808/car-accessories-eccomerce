import React from "react";
import Loading from "../../../components/common/alert/Loading";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/actions/authActions";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const dispatch = useDispatch();
    const nav = useNavigate();
    const auth = useSelector(state => state.auth);

    React.useEffect(() => {
        if (auth.token) {
            dispatch(logout());
        } else {
            nav("/")
        }
        setIsLoading(false);
    }, [dispatch, nav, auth]);
    return (
        <>
            {
                isLoading && <Loading />
            }
        </>
    )
}

export default Logout;