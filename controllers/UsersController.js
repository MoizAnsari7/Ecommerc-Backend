const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const Users = require('../model/Users');
const logger = require("../config/logger");
require("dotenv").config();

const UserController = {
    // User Registration
    userRegister: async (req, res) => {
        const { name, email, phone, password, confirmPassword, role } = req.body;

        logger.debug(`Register request body: ${JSON.stringify(req.body)}`);

        if (!name || !email || !phone || !password || !role) {
            logger.warn("Registration failed: Missing required fields");
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password !== confirmPassword) {
            logger.warn("Registration failed: Passwords do not match");
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        try {
            const existingUser = await Users.findOne({ email });
            if (existingUser) {
                logger.warn(`Registration failed: Email already registered - ${email}`);
                return res.status(400).json({
                    success: false,
                    message: "Email already registered"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const data = await Users.create({
                name,
                email,
                phone,
                role,
                password: hashedPassword,
                email_verified_at: null,
                remember_token: null
            });

            logger.info(`User registered successfully: ${email}`);
            res.status(201).json({
                success: true,
                data: data,
                message: "Registration Successful! Redirecting to login page..."
            });

        } catch (error) {
            logger.error("Registration error", error);
            res.status(500).json({
                success: false,
                error: error.message,
                message: "Server error"
            });
        }
    },

    // User Login
    userLogin: async (req, res) => {
        const { email, password } = req.body;

        logger.debug(`Login attempt for email: ${email}`);

        if (!email || !password) {
            logger.warn("Login failed: Missing email or password");
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        try {
            const user = await Users.findOne({ email });
            if (!user) {
                logger.warn(`Login failed: User not found - ${email}`);
                return res.status(400).json({
                    success: false,
                    message: "User not found",
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                logger.warn(`Login failed: Wrong password for email - ${email}`);
                return res.status(400).json({
                    success: false,
                    message: "Wrong password"
                });
            }

            let payload = {
                email: user.email,
                id: user._id,
                role: user.role
            }

            const token = jwt.sign(payload, process.env.JWT_SECRETE, { expiresIn: "2h" });

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            logger.info(`User logged in successfully: ${email}`);

            res.cookie("token", token, options).status(200).json({
                success: true,
                user: user,
                message: "Login success",
                token
            });

        } catch (error) {
            logger.error("Login error", error);
            res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    },

    // Edit Profile
        editProfile: async (req, res) => {
        const id = req.user._id;
        const { name, email, phone, password } = req.body;

        logger.debug(`Profile update request for user ID: ${id}`);

        try {
            const user = await Users.findById(id);
            if (!user) {
                logger.warn(`Edit profile failed: User not found - ID: ${id}`);
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            user.name = name || user.name;
            user.email = email || user.email;
            user.phone = phone || user.phone;

            if (password) {
                user.password = await bcrypt.hash(password, 10);
            }

            const updatedUser = await Users.findByIdAndUpdate(
                { _id: id },
                { name: user.name, email: user.email, phone: user.phone, password: user.password },
                { new: true }
            );

            logger.info(`User profile updated successfully: ${id}`);
            return res.status(200).json({
                success: true,
                data: updatedUser,
                message: "User info updated"
            });

        } catch (error) {
            logger.error("Edit profile error", error);
            res.status(500).json({
                success: false,
                error: error.message,
                message: "Server error"
            });
        }
    },

    // Get Profile
    getProfile: async (req, res) => {
        const id = req.user._id;

        logger.debug(`Fetching profile for user ID: ${id}`);

        try {
            const user = await Users.findById(id);

            if (!user) {
                logger.warn(`Profile fetch failed: User not found - ID: ${id}`);
                return res.status(404).json({
                    success: false,
                    message: "Profile not found"
                });
            }

            logger.info(`Profile fetched successfully for user ID: ${id}`);
            return res.status(200).json({
                success: true,
                data: user,
                message: "Profile found",
            });

        } catch (error) {
            logger.error("Get profile error", error);
            res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    },

    getAllUsers : async (req, res) => {
        try {
            logger.debug("Request recevied for GetAllUsers");

            const users = await Users.find().select('-password');

            logger.info("Users fetched successfuly");
            res.status(200).json({
                success : true,
                data : users,
                message : "Users fetched successfully"
            });
        } catch (error) {
            logger.error("Failed to fetch users", error);
            res.status(500).json({
                success : false,
                message : "Failed to fetch users",
                error: err.message
            });
        }
    }
};

module.exports = UserController;