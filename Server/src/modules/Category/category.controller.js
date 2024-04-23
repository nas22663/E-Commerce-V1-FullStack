import Category from "../../../DB/models/category.model.js";

export const createCategory = async (req, res, next) => {
  const { name } = req.body;
  const { _id } = req.authUser;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const newCategory = new Category({ name });
  await newCategory.save();
  return res.status(201).json({ category: newCategory });
};
