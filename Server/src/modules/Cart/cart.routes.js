import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as cartController from "./cart.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { cartEndpoints } from "./cart.endpoints.js";

const router = Router();

router.post(
  "/",
  auth(cartEndpoints.ADD_CART),
  expressAsyncHandler(cartController.addToCart)
);

router.put(
  "/:productId",
  auth(cartEndpoints.ADD_CART),
  expressAsyncHandler(cartController.removeFromCart)
);

router.get(
  "/",
  auth(cartEndpoints.GET_CART),
  expressAsyncHandler(cartController.getCart)
);

export default router;
