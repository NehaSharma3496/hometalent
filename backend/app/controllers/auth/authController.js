// Login method
const { User, Role } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { commonEmail } = require("../../helper/commonEmail");
const { Op, Sequelize } = require('sequelize');


exports.createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        let isExistsEmail = await User.findOne({ where: { email } });
        if (isExistsEmail) {
            return res.json({ status: false, msg: 'Email already exists' });
        }

        let status = 0;
        if (req.body.role_id === 1) {
            status = 1;
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone: req.body.phone || '', // Optional field
            role_id: req.body.role_id || 2, // Default to 'User' role
            kyc_verified: req.body.kyc_verified || false, // Default to false
            wallet_balance: req.body.wallet_balance || 0.00, // Default to 0.00
            status: status,
        });

        if (![1, 2].includes(user.role_id)) {
            const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, { expiresIn: '12h' });

            let baseUrl = `${req.protocol}://${req.get('host')}`;
            if (baseUrl.includes("localhost")) {
                baseUrl = `http://localhost:3000/#`;
            } else {
                baseUrl = baseUrl
            }
            const resetLink = `${baseUrl}/set-password?token=${token}`;
            await commonEmail(
                user.email,
                'Set Your Password',
                `<p>Hi ${user.first_name},</p>
                   <p>Please click the link below to set your password:</p>
                   <a href="${resetLink}">Set Password</a>
                   <p>This link will expire in 12 hours.</p>`,
            );
        }


        res.json({ status: true, data: user });
    } catch (error) {
        res.json({ status: false, msg: error.message });
    }
};



exports.setPassword = async (req, res) => {

    try {
        const { token, password } = req.body;
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.json({ status: false, msg: 'Link expired. Please contact the admin.' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        await User.update(
            { password: hashedPassword },
            { where: { id: decoded.id } }
        );

        return res.json({ status: true, msg: 'Password set successfully' });

    } catch (err) {
        return res.json({ msg: err.message });
    }
};




exports.getUser = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.body;
        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            include: [
                {
                    model: Role,
                    attributes: ['id', 'role_name', 'role'],
                },
            ],
            where: {
                [Op.or]: [
                    { first_name: { [Op.like]: `%${search}%` } },
                    { last_name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                    { phone: { [Op.like]: `%${search}%` } }
                ]
            },
            attributes: {
                exclude: ['password'],
            },
            limit,
            offset,
            order: [['id', 'DESC']]
        });

        res.json({
            status: true,
            data: rows,
            pagination: {
                totalUsers: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limitPerPage: limit
            }
        });
    } catch (error) {
        res.json({ status: false, msg: error.message });
    }
}


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: Role,
                    attributes: ['id', 'role_name', 'role'],
                },
            ],
        });

        if (!user) {
            return res.json({ status: false, msg: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ status: false, msg: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email, role: user.Role }, process.env.JWT_SECRET, {
            expiresIn: '8h',
        });

        res.cookie("token", token, {
            httpOnly: false,
            secure: false,
            sameSite: "Lax",
            maxAge: 8 * 60 * 60 * 1000,
        });

        return res.json({ status: true, data: user, token: token });
    } catch (error) {
        res.json({ status: false, msg: error.message });
    }
};


exports.getAllRoles = async (req, res) => {
    try {
        const user = await Role.findAll({
            where: {
                is_disable: 1, role: {
                    [Op.notIn]: ["ADMIN", "USER"]
                }
            },
        });
        res.status(200).json({ status: true, data: user });
    } catch (error) {
        res.status(400).json({ status: false, msg: error.message });
    }
}


exports.updateUserStatus = async (req, res) => {
    try {
        const { user_id, status } = req.body;

        if (!user_id) {
            return res.json({ status: false, msg: "user_id is required", data: [] });
        }

        if (status === undefined || status === null) {
            return res.json({ status: false, msg: "Status is required", data: [] });
        }

        await User.update(
            { status: status },
            { where: { id: user_id } }
        );

        const user = await User.findOne({ where: { id: user_id } });

        if (!user) {
            return res.json({ status: false, msg: "User Not Found", data: [] });
        }

        res.json({ status: true, msg: "Status Updated Successfully", data: user });

    } catch (error) {
        res.json({ status: false, msg: error.message, data: [] });
    }
};


exports.editUser = async (req, res) => {
    try {

        const {
            id,
            first_name,
            last_name,
            email,
            phone,
            role_id,
            kyc_verified,
            wallet_balance,
            status,
            password
        } = req.body;


        const user = await User.findByPk(id);
        if (!user) {
            return res.json({ status: false, msg: 'User not found' });
        }


        if (email && email !== user.email) {
            const isExistsEmail = await User.findOne({ where: { email } });
            if (isExistsEmail) {
                return res.json({ status: false, msg: 'Email already exists' });
            }
        }


        await user.update({
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name,
            email: email || user.email,
            phone: phone || user.phone,
            role_id: role_id || user.role_id,


        });

        res.json({ status: true, msg: 'User updated successfully', data: user });

    } catch (error) {
        res.json({ status: false, msg: error.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.json({ status: false, msg: "user_id is required", data: [] });
        }

        const user = await User.findOne({ where: { id: user_id } });

        if (!user) {
            return res.json({ status: false, msg: "User not found", data: [] });
        }

        await User.destroy({ where: { id: user_id } });

        return res.json({ status: true, msg: "User deleted successfully", data: [] });
    } catch (error) {
        return res.json({ status: false, msg: error.message, data: [] });
    }
};



exports.exportUser = async (req, res) => {
    try {
        const { search = "" } = req.body;

        const users = await User.findAll({
            include: [
                {
                    model: Role,
                    attributes: ['id', 'role_name', 'role'],
                },
            ],
            where: {
                [Op.or]: [
                    { first_name: { [Op.like]: `%${search}%` } },
                    { last_name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                    { phone: { [Op.like]: `%${search}%` } }
                ]
            },
            attributes: {
                exclude: ['password'],
            },
            order: [['id', 'DESC']]
        });

        res.json({
            status: true,
            data: users
        });
    } catch (error) {
        res.json({ status: false, msg: error.message });
    }
}
