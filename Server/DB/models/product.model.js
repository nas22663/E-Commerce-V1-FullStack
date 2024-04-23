import mongoose, { Schema } from "mongoose";

export const productSchema = new mongoose.Schema(
  {
    //strings
    title: { type: String, required: true, trim: true },
    desc: String,
    slug: { type: String, required: true },
    folderId: { type: String, required: true },

    //numbers
    basePrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    appliedPrice: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },

    //objectIds
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    //arrays
    images: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true, unique: true },
      },
    ],
    specs: {
      type: Map,
      of: [String | Number],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
