import jwt from 'jsonwebtoken';
import { getUserInfoById } from '../services/userService';

export const handleGetUserInfo = async (req, res) => {

    try {
        let decoded = jwt.verify(req.headers?.authorization?.split(' ')[1], process.env.ACCESS_TOKEN_SERCET_KEY); // Bearer *token*

        let user = await getUserInfoById(decoded?.id);

        if (!user) {
            console.log("User not found");
            return res.status(204).send("User not found");
        }

        console.log("Get user info successfully");
        return res.status(200).send({ msg: "Get user info successfully", user: user });
    } catch (error) {
        return res.status(401).send("jwt expired");
    }
}