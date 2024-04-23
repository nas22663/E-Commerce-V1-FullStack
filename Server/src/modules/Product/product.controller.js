import slugify from "slugify";
import Product from "../../../DB/models/product.model.js";
import User from "../../../DB/models/user.model.js";
import Category from "../../../DB/models/category.model.js";
import Brand from "../../../DB/models/brand.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import generateUniqueString from "../../utils/generate-unique-string.js";
import { systemRoles } from "../../utils/system-roles.js";

export const addProduct = async (req, res, next) => {
  const { title, desc, basePrice, discount, stock, specs } = req.body;
  const { categoryId, brandId } = req.query;
  const addedBy = req.authUser._id;

  //brand check
  const brand = await Brand.findById(brandId);
  if (!brand) {
    return next(new Error("Brand not found", { cause: 404 }));
  }
  if (brand.categoryId.toString() !== categoryId) {
    return next(new Error("Category not found", { cause: 404 }));
  }

  //authorization
  if (
    brand.addedBy.toString !== addedBy &&
    req.authUser.role !== systemRoles.SUPER_ADMIN
  ) {
    return next(new Error("Unauthorized", { cause: 401 }));
  }

  //slug
  const slug = slugify(title, { lower: true, replacement: "_", trim: true });

  const appliedPrice = basePrice - (basePrice * (discount || 0)) / 100;

  if (req.files?.length === 0) {
    return next(new Error("Please provide at least one image", { cause: 400 }));
  }

  let images = [];
  let folderId = generateUniqueString(4);
  // ecommerce/men/brands/adidas/pa2e/hbpbsn6ocb6cbaut1uun
  const folder = brand.image.public_id.split(`${brand.folderId}/`)[0];

  for (const file of req.files) {
    const { secure_url, public_id } =
      await cloudinaryConnection().uploader.upload(file.path, {
        folder: folder + `${brand.folderId}` + `/products/${folderId}`,
      });

    images.push({ secure_url, public_id });
  }

  req.folder = folder + `${brand.folderId}` + `${folderId}`;

  const productObjective = {
    title,
    slug,
    desc,
    basePrice,
    discount,
    appliedPrice,
    stock,
    images,
    specs: JSON.parse(specs),
    categoryId,
    brandId,
    addedBy,
    folderId,
  };

  const product = await Product.create(productObjective);
  req.savedDocument = { model: Product, _id: product._id };

  return res.status(201).json({ product });
};

export const updateProduct = async (req, res, next) => {
  const { _id } = req.authUser;
  const { productId } = req.params;
  const { title, desc, stock, basePrice, discount, specs, oldPublicId } =
    req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  if (
    product.addedBy.toString() !== _id &&
    req.authUser.role !== systemRoles.SUPER_ADMIN
  ) {
    return next(new Error("Unauthorized", { cause: 401 }));
  }

  if (title) product.title = title;
  const slug = slugify(title, { lower: true, replacement: "_", trim: true });
  product.slug = slug;
  if (desc) product.desc = desc;
  if (stock) product.stock = stock;

  const appliedPrice =
    (basePrice || product.basePrice) *
    (1 - (discount || product.discount) / 100);
  product.appliedPrice = appliedPrice;

  if (basePrice) product.basePrice = basePrice;
  if (discount) product.discount = discount;
  if (specs) product.specs = JSON.parse(specs);

  if (oldPublicId) {
    if (!req.file) {
      await cloudinaryConnection().uploader.destroy(oldPublicId);
    }
    const newPublicId = oldPublicId.split(`${product.folderId}/`)[1];

    const { secure_url } = await cloudinaryConnection().uploader.upload(
      req.file.path,
      {
        folder: `${oldPublicId.split(`${product.folderId}/`)[0]}${
          product.folderId
        }`,
        public_id: newPublicId,
      }
    );
    product.images.map((img) => {
      if (img.public_id === oldPublicId) {
        img.secure_url = secure_url;
      }
    });
  }
  const updateProduct = await product.save();
  req.savedDocument = { model: Product, _id: updateProduct._id };
  return res.status(200).json({ product: updateProduct });
};

export const deleteProduct = async (req, res, next) => {
  const { _id } = req.authUser;
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  if (
    product.addedBy.toString() !== _id &&
    req.authUser.role !== systemRoles.SUPER_ADMIN
  ) {
    return next(new Error("Unauthorized", { cause: 401 }));
  }

  const folderPath = `${
    product.images[0].public_id.split(`${product.folderId}/`)[0]
  }${product.folderId}/`;

  await cloudinaryConnection().api.delete_resources_by_prefix(folderPath);
  await cloudinaryConnection().api.delete_folder(folderPath);

  await Product.findByIdAndDelete(productId);
  return res.status(200).json({ success: true });
};

export const getProduct = async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  return res.status(200).json({ product });
};
