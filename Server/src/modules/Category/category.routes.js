import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as categoryController from "./category.controller.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import * as validators from "./category.validationSchema.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { categoryEndpoints } from "./category.endpoints.js";

const router = Router();

router.post(
  "/",
  auth(categoryEndpoints.ADD_CATEGORY),
  validationMiddleware(validators.createCategorySchema),
  expressAsyncHandler(categoryController.createCategory)
);

export default router;
