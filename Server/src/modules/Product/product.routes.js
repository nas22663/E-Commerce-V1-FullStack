import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { multerMiddleHost } from "../../middlewares/multer.middleware.js";
import * as controllers from "./product.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";
import { productEndPoints } from "./product.endPoints.js";

const router = Router();

router.post(
  "/",
  auth(productEndPoints.addProduct),
  multerMiddleHost({ extensions: allowedExtensions.image }).array("image", 4),
  controllers.addProduct
);

router.put(
  "/update/:productId",
  auth(productEndPoints.addProduct),
  multerMiddleHost({ extensions: allowedExtensions.image }).single("image"),
  controllers.updateProduct
);

router.delete(
  "/:productId",
  auth(productEndPoints.addProduct),
  controllers.deleteProduct
);

router.get("/:productId", expressAsyncHandler(controllers.getProduct));

export default router;
