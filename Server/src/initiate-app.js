import db_connection from "../DB/connection.js";
import * as routers from "./modules/index.routes.js";
import { globalResponse } from "./middlewares/global-response.middleware.js";
import { rollbackUploadedFiles } from "./middlewares/rollback-uploaded-files.middleware.js";
import { rollbackSavedDocuments } from "./middlewares/rollback-saved-documents.middlewares.js";
import cors from "cors";

export const initiateApp = (app, express) => {
  const port = process.env.PORT || 3000;
  app.use(express.json());
  app.use(cors());
  db_connection();

  app.use("/user", routers.userRoutes);
  app.use("/auth", routers.authRoutes);
  app.use("/category", routers.categoryRoutes);
  app.use("/brand", routers.brandRoutes);
  app.use("/product", routers.productRoutes);
  app.use("/cart", routers.cartRoutes);
  app.use("/order", routers.orderRoutes);

  app.use(globalResponse, rollbackUploadedFiles, rollbackSavedDocuments);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
