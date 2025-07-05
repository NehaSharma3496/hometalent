// Login method
const { User, Role } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { commonEmail } = require("../../helper/commonEmail");
const { Op, Sequelize } = require('sequelize');




function generateRandomPassword(length = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
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
      social_media_link,
      role_id
    } = req.body;

    // ✅ Access image and video from req.files
    const imageFile = req.files?.image?.[0];
    const videoFile = req.files?.video?.[0];

    let image = imageFile ? imageFile.filename : null;
    let video = videoFile ? videoFile.filename : null;

    var password = generateRandomPassword();

    // ✅ Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }]
      }
    });

    if (existingUser) {
      return res.json({
        status: false,
        msg: 'Email or phone already registered'
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
      social_media_link,
      image,
      video,
      role_id: role_id || 2,
      password: hashedPassword,
      show_password: password
    });

    res.json({
      status: true,
      msg: 'User created successfully',
      data: user
    });

  } catch (error) {
    console.error("Error in createUser:", error);
    res.json({ status: false, msg: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email or phone
    console.log("Login attempt with identifier:", req.body);
    
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { phone: identifier }]
      }
    });

    if (!user) {
      return res.json({ status: false, msg: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ status: false, msg: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      status: true,
      msg: 'Login successful',
      token,
      user
    });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

