import e from 'express';
import { handleFollowProduct, handleGetFollowingProducts, handleUnfollowProduct } from '../controllers';

let route = e.Router();

const followingRoute = (app) => {
  route.get("/", handleGetFollowingProducts);
  route.post("/", handleFollowProduct);
  route.delete("/:id", handleUnfollowProduct);

  return app.use("/api/v1/follow", route);
}

export default followingRoute;