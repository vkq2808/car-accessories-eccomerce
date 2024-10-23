import React from "react";
import Loading from "../../components/common/alert/Loading";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authActions";

const Logout = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(logout()).then(() => {
            setIsLoading(false);
        });
    }, [dispatch]);
    return (
        <>
            {
                isLoading && <Loading />
            }
        </>
    )
}

export default Logout;