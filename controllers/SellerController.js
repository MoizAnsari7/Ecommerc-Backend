const bcrypt = require('bcryptjs');
const Seller = require('../model/Seller');
const logger = require('../config/logger');

const SellerController = {
    // Seller Registration
    sellerRegister: async (req, res) => {
        const { name, email, phone, password, confirmPassword } = req.body;

        logger.debug(`Registration request received with body: ${JSON.stringify(req.body)}`);

        if (!name || !email || !phone || !password || !confirmPassword) {
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
            const existingSeller = await Seller.findOne({ email });
            if (existingSeller) {
                logger.warn(`Registration attempt with existing email: ${email}`);
                return res.status(400).json({
                    success: false,
                    message: "Email already registered"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const data = await Seller.create({
                name,
                email,
                phone,
                password: hashedPassword,
                email_verified_at: null,
                remember_token: null
            });

            logger.info(`New seller registered: ${email}`);

            return res.status(201).json({
                success: true,
                data: data,
                message: "Registration successful! Redirecting to login page..."
            });

        } catch (error) {
            logger.error("Registration error", error);
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    },

    // Seller Login
    sellerLogin: async (req, res) => {
        const { email, password } = req.body;

        logger.debug(`Login attempt with email: ${email}`);

        if (!email || !password) {
            logger.warn("Login failed: Missing email or password");
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        try {
            const seller = await Seller.findOne({ email });
            if (!seller) {
                logger.warn(`Login failed: Email not found - ${email}`);
                return res.status(400).json({
                    success: false,
                    message: "Email not Found"
                });
            }

            const isMatch = await bcrypt.compare(password, seller.password);
            if (!isMatch) {
                logger.warn(`Login failed: Incorrect password for email - ${email}`);
                return res.status(400).json({
                    success: false,
                    message: "Wrong password"
                });
            }

            logger.info(`Login successful for seller: ${email}`);

            return res.status(200).json({
                success: true,
                data: seller,
                message: "Login successful"
            });

        } catch (error) {
            logger.error("Login error", error);
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    },

    // Edit Profile
    editProfile: async (req, res) => {
        const { id } = req.params;
        const { name, email, phone, password } = req.body;

        logger.debug(`Edit profile request for seller ID: ${id} with body: ${JSON.stringify(req.body)}`);

        try {
            const seller = await Seller.findById(id);
            if (!seller) {
                logger.warn(`Edit profile failed: Seller not found with ID - ${id}`);
                return res.status(404).json({
                    success: false,
                    message: "Seller not found"
                });
            }

            seller.name = name || seller.name;
            seller.email = email || seller.email;
            seller.phone = phone || seller.phone;

            if (password) {
                seller.password = await bcrypt.hash(password, 10);
            }

            const updatedSeller = await Seller.findByIdAndUpdate(
                { _id: id },
                {
                    name: seller.name,
                    email: seller.email,
                    phone: seller.phone,
                    password: seller.password
                },
                { new: true }
            );

            logger.info(`Seller profile updated for ID: ${id}`);

            return res.status(200).json({
                success: true,
                data: updatedSeller,
                message: "Seller info updated"
            });

        } catch (error) {
            logger.error("Edit profile error", error);
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    },

    // Get Profile
    getProfile: async (req, res) => {
        const { id } = req.params;

        logger.debug(`Fetching profile for seller ID: ${id}`);

        try {
            const seller = await Seller.findById(id);

            if (!seller) {
                logger.warn(`Get profile failed: Seller not found with ID - ${id}`);
                return res.status(404).json({
                    success: false,
                    message: "Profile not found"
                });
            }

            logger.info(`Profile fetched for seller ID: ${id}`);

            return res.status(200).json({
                success: true,
                data: seller,
                message: "Profile found"
            });

        } catch (error) {
            logger.error("Get profile error", error);
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    }
};

module.exports = SellerController;
