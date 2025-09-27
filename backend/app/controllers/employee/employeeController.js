// Login method
const { User, Role, Notification, Permission, UserPermission } = require("../../models");
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

exports.addEmployee = async (req, res) => {
  try {
    const {
      profile_name,
      phone,
      email,
      password,
      role_id,
    } = req.body;
  
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
      profile_name,
      phone,
      email,
      role_id: role_id || 3,
      password: hashedPassword,
      show_password: password,
    });

    let subject = "Login Details";
    message = `
        <p>Hi ${profile_name},</p>
        <p>Your profile has been created. You can now log in using either your <strong>email</strong> or <strong>mobile number</strong>.</p>
        <p><strong>Login Email:</strong> ${email}</p>
        <p><strong>Login Mobile:</strong> ${phone}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Click here to login: <a href="${req.headers.origin}/login">Login</a></p> 
        <p>Thank you,<br/>Team HomeTalent</p>
      `;
    await commonEmail(email, subject, message);
    return res.json({
      status: true,
      msg: "Employee created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in createEmployee:", error);
    return res.json({ status: false, msg: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { profile_name, phone, email, password } = req.body;

    const employee = await User.findOne({ where: { id, role_id: 3 } });
    if (!employee) {
      return res.json({ status: false, msg: "Employee not found" });
    }

    // ✅ Check if email/phone already exists for another user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
        id: { [Op.ne]: id },
      },
    });

    if (existingUser) {
      return res.json({
        status: false,
        msg: "Email or phone already registered with another account",
      });
    }

    let updatedData = { profile_name, email, phone };

    if(password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
      updatedData.show_password = password;
    }

    await employee.update(updatedData);

    return res.json({
      status: true,
      msg: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Error in updateEmployee:", error);
    return res.json({ status: false, msg: error.message });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    // Extract page & limit from request (query or body)
     const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Fetch employees with pagination
    const { rows: employees, count: total } = await User.findAndCountAll({
      where: { role_id: 3 },
      attributes: ["id", "profile_name", "email", "phone", "status", "createdAt"],
      order: [["id", "DESC"]],
      limit,
      offset,
    });

    return res.json({
      status: true,
      msg: "Employees fetched successfully",
      data: employees,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Error in getEmployees:", error);
    return res.json({ status: false, msg: error.message });
  }
};


exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findOne({ where: { id, role_id: 3 } });
    if (!employee) {
      return res.json({ status: false, msg: "Employee not found" });
    }

    await employee.destroy();

    return res.json({
      status: true,
      msg: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteEmployee:", error);
    return res.json({ status: false, msg: error.message });
  }
};

exports.assignPermissions = async (req, res) => {
  try {
    const { user_id, permission_ids } = req.body; 
    // Ensure user is employee
    const user = await User.findOne({ where: { id: user_id, role_id: 3 } });
    if (!user) return res.json({ status: false, msg: "Employee not found" });

    // Remove old permissions
    await UserPermission.destroy({ where: { user_id } });

    // Assign new permissions
    const bulkData = permission_ids.map(pid => ({ user_id, permission_id: pid }));
    await UserPermission.bulkCreate(bulkData);

    return res.json({ status: true, msg: "Permissions updated successfully" });
  } catch (error) {
    console.error("Error in assignPermissions:", error);
    return res.json({ status: false, msg: error.message });
  }
};

exports.getEmployeePermissions = async (req, res) => {
  try {
    const { user_id } = req.params;

    const permissions = await UserPermission.findAll({
      where: { user_id },
      include: [{ model: Permission, attributes: ["id", "name", "slug"] }],
    });

    return res.json({
      status: true,
      data: permissions.map(p => p.Permission),
    });
  } catch (error) {
    console.error("Error in getEmployeePermissions:", error);
    return res.json({ status: false, msg: error.message });
  }
};

exports.getallpermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      attributes: ["id", "name", "slug"],
      order: [["id", "ASC"]],
    });
    return res.json({ status: true, data: permissions });
  } catch (error) {
    console.error("Error in getallpermissions:", error);
    return res.json({ status: false, msg: error.message });
  }
};

exports.checkEmployeePermission = async (req, res) => {
  try {
    const { user_id, slug } = req.body; // or req.query

    if (!user_id || !slug) {
      return res.json({
        status: false,
        msg: "user_id and slug are required",
      });
    }

    // Find permission record
    const permission = await Permission.findOne({ where: { slug } });

    if (!permission) {
      return res.status(404).json({
        status: false,
        msg: "Permission not found",
      });
    }

    // Check if employee has this permission
    const hasPermission = await UserPermission.findOne({
      where: {
        user_id,
        permission_id: permission.id,
      },
    });

    return res.json({
      status: true,
      user_id,
      slug,
      allowed: !!hasPermission,
    });

  } catch (error) {
    console.error("Error in checkEmployeePermission:", error);
    return res.json({
      status: false,
      msg: error.message,
    });
  }
};










