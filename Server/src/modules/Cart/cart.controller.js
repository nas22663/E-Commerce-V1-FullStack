import Cart from "../../../DB/models/cart.model.js";
import Product from "../../../DB/models/product.model.js";
import { addCart } from "./utils/add-cart.js";
import { checkProductAvailability } from "./utils/check-product-in-db.js";
import { getUserCart } from "./utils/get-user-cart.js";

export const addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { _id: userId } = req.authUser;

  const product = await checkProductAvailability(productId, quantity);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  const userCart = await getUserCart(userId);
  if (!userCart) {
    const cart = await addCart(userId, product, quantity);

    return res.status(201).json({ message: "Product added to cart", cart });
  }
  let productExist = false;
  //   let subTotal = 0;
  userCart.products.forEach((product) => {
    if (product.productId.toString() === productId.toString()) {
      product.quantity += quantity;
      product.finalPrice = product.basePrice * product.quantity;
      productExist = true;
    }
  });
  if (!productExist) {
    userCart.products.push({
      productId,
      quantity,
      basePrice: product.appliedPrice,
      finalPrice: product.appliedPrice * quantity,
      title: product.title,
    });
  }
  const updatedSubTotal = userCart.products.reduce(
    (acc, curr) => acc + curr.finalPrice,
    0
  );
  userCart.subTotal = updatedSubTotal;
  await userCart.save();

  return res.status(201).json({ message: "Product added to cart", userCart });
};

export const removeFromCart = async (req, res, next) => {
  const { productId } = req.params;
  const { _id: userId } = req.authUser;

  const userCart = await getUserCart(userId);
  if (!userCart) {
    return next(new Error("Cart not found", { cause: 404 }));
  }

  userCart.products = userCart.products.filter(
    (product) => product.productId.toString() !== productId.toString()
  );
  let subTotal = 0;
  for (const product of userCart.products) {
    subTotal += product.finalPrice;
  }
  userCart.subTotal = subTotal;
  const updatedCart = await userCart.save();

  if (updatedCart.products.length === 0) {
    await Cart.findByIdAndDelete(updatedCart._id);
  }

  return res
    .status(200)
    .json({ message: "Product removed from cart", updatedCart });
};

export const getCart = async (req, res, next) => {
  const { _id: userId } = req.authUser;
  const userCart = await getUserCart(userId);
  if (!userCart) {
    return next(new Error("Cart not found", { cause: 404 }));
  }

  return res.status(200).json({ userCart });
};
