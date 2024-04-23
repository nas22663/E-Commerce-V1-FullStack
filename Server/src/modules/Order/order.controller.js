import { checkProductAvailability } from "../Cart/utils/check-product-in-db.js";
import { getUserCart } from "../Cart/utils/get-user-cart.js";
import Order from "../../../DB/models/order.model.js";
import Cart from "../../../DB/models/cart.model.js";
import Product from "../../../DB/models/product.model.js";

export const createOrder = async (req, res, next) => {
  const { _id: userId } = req.authUser;
  const {
    product,
    quantity,
    paymentMethod,
    phoneNumbers,
    address,
    city,
    postalCode,
    country,
  } = req.body;

  const isProductAvailable = await checkProductAvailability(product, quantity);

  if (!isProductAvailable) {
    return next(new Error("Product is not available", { cause: 400 }));
  }

  let orderItems = [
    {
      title: isProductAvailable.title,
      quantity: quantity,
      price: isProductAvailable.appliedPrice,
      product: isProductAvailable._id,
    },
  ];

  let shippingPrice = orderItems[0].price * quantity;
  let totalPrice = shippingPrice;

  let orderStatus = "Pending";
  if (paymentMethod === "Cash") {
    orderStatus = "Placed";
  }

  const order = new Order({
    user: userId,
    orderItems,
    shippingAddress: {
      address,
      city,
      postalCode,
      country,
    },
    shippingPrice,
    phoneNumbers,
    paymentMethod,
    orderStatus,
    totalPrice,
  });

  await order.save();

  isProductAvailable.stock = isProductAvailable.stock - quantity;
  await isProductAvailable.save();

  res.status(201).json({ message: "Order created successfully", order });
};

export const cartToOrder = async (req, res, next) => {
  const { _id: userId } = req.authUser;
  const { paymentMethod, phoneNumbers, address, city, postalCode, country } =
    req.body;

  const userCart = await getUserCart(userId);
  if (!userCart) {
    return next(new Error("Cart is empty", { cause: 400 }));
  }

  console.log(userCart);
  let orderItems = userCart.products.map((item) => {
    return {
      title: item.title,
      quantity: item.quantity,
      price: item.basePrice,
      product: item.productId,
    };
  });

  let shippingPrice = userCart.subTotal;
  let totalPrice = shippingPrice;

  let orderStatus = "Pending";
  if (paymentMethod === "Cash") {
    orderStatus = "Placed";
  }

  const order = new Order({
    user: userId,
    orderItems,
    shippingAddress: {
      address,
      city,
      postalCode,
      country,
    },
    shippingPrice,
    phoneNumbers,
    paymentMethod,
    orderStatus,
    totalPrice,
  });

  await order.save();

  await Cart.findByIdAndDelete(userCart._id);

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    product.stock = product.stock - item.quantity;
    await product.save();
  }

  res.status(201).json({ message: "Order created successfully", order });
};
