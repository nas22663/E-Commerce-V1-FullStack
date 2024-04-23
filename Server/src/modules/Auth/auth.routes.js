import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as authController from "./auth.controller.js";
import { multerMiddleHost } from "../../middlewares/multer.middleware.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import * as validators from "./auth.validationSchema.js";

const router = Router();

router.post(
  "/signup",
  multerMiddleHost({ extensions: allowedExtensions.image }).single(
    "profilePicture"
  ),
  validationMiddleware(validators.signUpSchema),

  expressAsyncHandler(authController.signUp)
);
router.get("/confirm-email", expressAsyncHandler(authController.confirmEmail));

router.post("/login", expressAsyncHandler(authController.login));

export default router;
