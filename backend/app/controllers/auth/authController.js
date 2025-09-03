// Login method
const { User, Role, Notification } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { commonEmail } = require("../../helper/commonEmail");
const { Op, Sequelize } = require("sequelize");
const socketManager = require("../../socket/socketManager");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

function generateRandomPassword(length = 10) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

exports.createUser = async (req, res) => {
  try {
    const {
      owner_name,
      profile_name,
      state_id,
      city_id,
      pin_code,
      phone,
      email,
      price_range,
      short_description,
      category_id,
      experience_since,
      long_description,
      facebook_link,
      instagram_link,
      twitter_link,
      linkedin_link,
      youtube_link,
      website_link,
      role_id,
    } = req.body;

    // ✅ Access image and video from req.files
    const imageFile = req.files?.image?.[0];
    const videoFile = req.files?.video?.[0];

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const image = imageFile ? `${baseUrl}/media/${imageFile.filename}` : null;
    const video = videoFile ? `${baseUrl}/media/${videoFile.filename}` : null;

    var password = generateRandomPassword();
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return res.json({
        status: false,
        msg: "Email or phone already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      owner_name,
      profile_name,
      state_id,
      city_id,
      pin_code,
      phone,
      email,
      price_range,
      short_description,
      category_id,
      experience_since,
      long_description,
      facebook_link,
      instagram_link,
      twitter_link,
      linkedin_link,
      youtube_link,
      website_link,
      image,
      video,
      role_id: role_id || 2,
      password: hashedPassword,
      show_password: password,
    });

    // Send socket notification for vendor registration
    if (user.role_id == 2) {
      socketManager.vendorRegistered({
        id: user.id,
        owner_name: user.owner_name,
        profile_name: user.profile_name,
        email: user.email,
        phone: user.phone,
      });
      try {
        await Notification.create({
          user_id: null,
          user_type: "admin",
          type: "vendor_registration_request",
          title: "Vendor Registration",
          message: "Vendor registration request recieved. Action required",
          metadata: { vendor_id: user.id },
        });
      } catch (e) {
        console.error(
          "Failed to persist admin notification for vendor registration:",
          e.message
        );
      }
    }

    res.json({
      status: true,
      msg: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    res.json({ status: false, msg: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email or phone

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user) {
      return res.json({ status: false, msg: "User not found" });
    }

    // 🔒 Check if user is inactive
    if (user.status !== 1) {
      return res.json({
        status: false,
        msg: "Your account is inactive. Please contact support.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ status: false, msg: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      status: true,
      msg: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email, url } = req.body;
  console.log("Req body", req.body);
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({ status: false, msg: "Email not registered." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await user.update({
      password_reset_token: token,
      password_reset_expires: expires,
    });

    // const resetLink = `${url}/${token}`;
    // var message = `<p>Click to reset your password: <a href="${resetLink}">${resetLink}</a></p>`;
    // await commonEmail(email, "Reset Password", message);
    // return res.json({
    //   status: true,
    //   msg: "Password reset link sent to your email.",
    // });

    const resetLink = `${url}/${token}`;
    const subject = "Reset Your HomeTalent Password";

    const message = `
  <h3>Click the link below to reset your HomeTalent password:</h3>
  <p>
    <a href="${resetLink}" target="_blank" style="color: #1a73e8; text-decoration: none;">
      Reset Password
    </a>
  </p>
  <br/>
`;

    await commonEmail(email, subject, message);

    return res.json({
      status: true,
      msg: "Password reset link sent to your email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.json({ status: false, msg: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, new_password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        password_reset_token: token,
        // password_reset_expires: { [Op.gt]: new Date() }
      },
    });

    if (!user) {
      return res.json({ status: false, msg: "Invalid or expired token." });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await user.update({
      password: hashedPassword,
      show_password: new_password,
      password_reset_token: null,
      password_reset_expires: null,
    });

    return res.json({ status: true, msg: "Password reset successful." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.json({ status: false, msg: error.message });
  }
};

exports.reset_password = async (req, res) => {
  try {
    const { oldPassword, newPassword, user_id } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: false,
        message: "Both old and new passwords are required.",
      });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Old password is incorrect." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.show_password = newPassword;
    await user.save();

    return res
      .status(200)
      .json({ status: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};
