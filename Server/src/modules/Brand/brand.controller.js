import slugify from "slugify";
import Brand from "../../../DB/models/brand.model.js";
import User from "../../../DB/models/user.model.js";
import Category from "../../../DB/models/category.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import generateUniqueString from "../../utils/generate-unique-string.js";

export const addBrand = async (req, res, next) => {
  const { name } = req.body;
  const { categoryId } = req.query;
  const { _id: addedBy } = req.authUser;

  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new Error("Category doesn't exist", { cause: 404 }));
  }

  const isBrandExist = await Brand.findOne({ name });
  if (isBrandExist) {
    return next(new Error("Brand already exist", { cause: 400 }));
  }

  const slug = slugify(name, { lower: true, replacement: "_", trim: true });

  if (!req.file) {
    return next(new Error("Please provide image", { cause: 400 }));
  }
  const folderId = generateUniqueString(4);

  const { secure_url, public_id } =
    await cloudinaryConnection().uploader.upload(req.file.path, {
      folder: `${process.env.MAIN_FOLDER}/${category.name}/brands/${slug}/${folderId}`,
    });
  req.folder = `{process.env.MAIN_FOLDER}/${category.name}/brands/${slug}/${folderId}`;
  console.log(req.folder);

  const brandObject = {
    name,
    slug,
    image: {
      secure_url,
      public_id,
    },
    folderId,
    addedBy,
    categoryId,
  };
  const brand = await Brand.create(brandObject);
  return res.status(201).json(brand);
};
