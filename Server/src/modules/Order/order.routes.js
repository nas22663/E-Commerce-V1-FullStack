import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as orderController from "./order.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { createOrderEndPoint } from "./order.endpoints.js";

const router = Router();

router.post(
  "/create",
  auth(createOrderEndPoint.roles),
  expressAsyncHandler(orderController.createOrder)
);

router.post(
  "/cartToOrder",
  auth(createOrderEndPoint.roles),
  expressAsyncHandler(orderController.cartToOrder)
);

export default router;
