import User from "../../../DB/models/user.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import { systemRoles } from "../../utils/system-roles.js";

export const updateUser = async (req, res, next) => {
  const {
    name,
    phoneNumbers,
    addresses,
    deletedAddresses,
    deletedPhoneNumbers,
    oldPublicId,
  } = req.body;
  const { _id } = req.authUser;

  const user = await User.findById(_id);

  if (!user) {
    return next({ status: 404, message: "User not found" });
  }
  if (req.authUser._id.toString() !== user._id.toString()) {
    return next({ status: 401, message: "Unauthorized" });
  }

  if (addresses) {
    addresses.forEach((newAddress) => {
      if (!user.addresses.includes(newAddress)) {
        user.addresses.push(newAddress);
      }
    });
  }

  if (phoneNumbers) {
    phoneNumbers.forEach((newPhoneNumber) => {
      if (!user.phoneNumbers.includes(newPhoneNumber)) {
        user.phoneNumbers.push(newPhoneNumber);
      }
    });
  }

  if (deletedAddresses && deletedAddresses.length > 0) {
    user.addresses = user.addresses.filter(
      (address) => !deletedAddresses.includes(address)
    );
  }

  if (deletedPhoneNumbers && deletedPhoneNumbers.length > 0) {
    user.phoneNumbers = user.phoneNumbers.filter(
      (phoneNumber) => !deletedPhoneNumbers.includes(phoneNumber)
    );
  }

  if (name) {
    user.name = name;
  }

  if (oldPublicId) {
    if (!req.file) {
      return next({ status: 400, message: "Profile picture is required" });
    }

    const newPublicId = oldPublicId.split(`${user.folderId}/`)[1];

    const { secure_url, public_id } =
      await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/profile_pics/${user.folderId}`,
        public_id: newPublicId,
      });
    user.profilePicture.secure_url = secure_url;
    await user.save();
  }

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: user,
  });
};

export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  const authUser = req.authUser;

  if (
    authUser._id.toString() !== userId &&
    authUser.role !== `${systemRoles.SUPER_ADMIN}`
  ) {
    return next({ status: 401, message: "Unauthorized" });
  }

  const user = await User.findByIdAndDelete(userId);

  // WE SHOULD DELETE PICTURES FROM CLOUDINARY -- DO LATER

  if (!user) {
    return next({ status: 404, message: "User not found" });
  }

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
};

export const getUser = async (req, res, next) => {
  const { _id } = req.authUser;

  const user = await User.findById(_id);

  res.status(200).json({
    status: "success",
    message: "User fetched successfully",
    data: user,
  });
};
