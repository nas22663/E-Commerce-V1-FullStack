import bcrypt from "bcryptjs";
import User from "../../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import sendEmailService from "../services/send-email.service.js";
import generateUniqueString from "../../utils/generate-unique-string.js";
import cloudinaryConnection from "../../utils/cloudinary.js";

export const signUp = async (req, res, next) => {
  const { name, email, password, phoneNumbers, addresses } = req.body;

  // check if user already exists
  const user = await User.findOne({ email });
  if (user) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }

  //email confirmation
  const token = jwt.sign({ email }, process.env.JWT_SECRET_VERIFCATION, {
    expiresIn: "1h",
  });

  const isEmailSent = await sendEmailService({
    to: email,
    subject: "Email Confirmation",
    message:
      "<h2>Click here to confirm your email</h2>" +
      `<a href="${req.protocol}://${req.headers.host}/auth/confirm-email/?email=${token}">Confirm Email</a>`,
  });

  if (!isEmailSent) {
    return next(new Error("Email could not be sent", { cause: 500 }));
  }

  // hash password
  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_Rounds);

  //upload profile pic

  let folderId = generateUniqueString(4);
  const { secure_url, public_id } =
    await cloudinaryConnection().uploader.upload(req.file.path, {
      folder: `${process.env.MAIN_FOLDER}/profile_pics/${folderId}`,
    });
  req.folder = `/${process.env.MAIN_FOLDER}/profile_pics/${folderId}`;

  const newUser = {
    name,
    email,
    password: hashedPassword,
    phoneNumbers,
    addresses,
    profilePicture: {
      secure_url,
      public_id,
    },
    folderId,
  };

  const createdUser = await User.create(newUser);

  req.savedDocument = { model: "User", _id: createdUser._id };

  return res.status(201).json({ user: createdUser });
};

export const confirmEmail = async (req, res, next) => {
  const { email } = req.query;
  const decodedData = jwt.verify(email, process.env.JWT_SECRET_VERIFCATION);

  const user = await User.findOneAndUpdate(
    {
      email: decodedData.email,
      isEmailVerified: false,
    },
    { isEmailVerified: true },
    { new: true }
  );

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  return res
    .status(200)
    .json({ message: "Email verified successfully", data: user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, isEmailVerified: true });

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const isPasswordMatch = bcrypt.compareSync(password, user.password);
  if (!isPasswordMatch) {
    return next(new Error("Password is incorrect", { cause: 400 }));
  }

  const token = jwt.sign({ id: user._id }, process.env.LOGIN_SIGNATURE, {
    expiresIn: "3d",
  });

  user.isloggedIn = true;
  await user.save();

  return res.status(200).json({ success: "true", user, token });
};
