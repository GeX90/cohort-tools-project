const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User.model");
const saltRounds = 10;
// POST /auth/signup
router.post('/signup', (req, res, next) => {
    const { email, password, name } = req.body;
    // Check if the email or password or name is provided as an empty string
    if (!email || !password || !name) {
        res.status(400).json({ message: "Provide email, password and name" });
        return;
    }
    // Use regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Provide a valid email address.' });
        return;
    }
    // Use regex to validate the password format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }
    // Check the users collection if a user with the same email already exists
    User.findOne({ email })
        .then((foundUser) => {
            // If the user with the same email already exists, send an error response
            if (foundUser) {
                res.status(400).json({ message: "User already exists." });
                return;
            }
            // If the email is unique, proceed to hash the password
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const newUser = {
                email: email,
                password: hashedPassword,
                name: name
            };
            // Create a new user in the database
            // We return a pending promise, which allows us to chain another `then`
            return User.create(newUser);
        })
        .then((createdUser) => {
            // Deconstruct the newly created user object to omit the password
            // (we will not send the hash to the client)
            const { email, name, _id } = createdUser;
            // Create a new object that doesn't expose the password
            const user = { email, name, _id };
            // Send a json response containing the user object
            res.status(201).json({ user: user });
        })
        .catch(err => {
            console.log("Error trying to create an account...\n\n", err);
            res.status(500).json({ message: "Internal Server Error" })
        });
});

// POST /auth/login
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Provide email and password" });
        return;
    }

    User.findOne({ email })
        .then((foundUser) => {
            if (!foundUser) {
                res.status(401).json({ message: "User not found." });
                return;
            }

            const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

            if (passwordCorrect) {
                const { email, name, _id } = foundUser;
                const user = { email, name, _id };
                res.status(200).json({ message: "Login successful", user: user });
            } else {
                res.status(401).json({ message: "Incorrect password." });
            }
        })
        .catch(err => {
            console.log("Error trying to login...\n\n", err);
            res.status(500).json({ message: "Internal Server Error" })
        });
});

// GET /auth/verify
router.get('/verify', (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    // TODO: Implementar verificación de JWT token
    res.status(200).json({ message: "Token is valid", user: {} });
});

module.exports = router;