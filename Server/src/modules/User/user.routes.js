import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import * as userController from "./user.controller.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { multerMiddleHost } from "../../middlewares/multer.middleware.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";
import { userEndpoints } from "./user.endPoints.js";

const router = Router();

router.put(
  "/",
  auth(userEndpoints.GENERAL),
  multerMiddleHost({ extensions: allowedExtensions.image }).single(
    "profilePicture"
  ),
  expressAsyncHandler(userController.updateUser)
);

router.delete(
  "/:userId",
  auth(userEndpoints.GENERAL),
  expressAsyncHandler(userController.deleteUser)
);

router.get(
  "/",
  auth(userEndpoints.GENERAL),
  expressAsyncHandler(userController.getUser)
);

export default router;
