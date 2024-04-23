import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { multerMiddleHost } from "../../middlewares/multer.middleware.js";
import * as controllers from "./brand.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";
import { brandEndPoints } from "./brand.endpoints.js";

const router = Router();

router.post(
  "/",
  auth(brandEndPoints.addBrand),
  multerMiddleHost({ extensions: allowedExtensions.image }).single("image"),
  expressAsyncHandler(controllers.addBrand)
);

export default router;
