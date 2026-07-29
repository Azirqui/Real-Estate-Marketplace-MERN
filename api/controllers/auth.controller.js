import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10)
    const newUser = new User({username, email, password: hashedPassword});
    try {
        await newUser.save()
        res.status(201).json("User created successfully!");
    }
    catch (error){
        next(errorHandler(500, "Error creating user"));
    }
};

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if (!validUser) {
            return next(errorHandler(404, "User not found"));
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Invalid password"));
        }
        jwt.sign({id: validUser._id}, process.env.JWT_SECRET, {expiresIn: "1h"}, (err, token) => {
            if (err) {
                return next(errorHandler(500, "Error signing in"));
            }
            const {password, ...rest} = validUser._doc;
            res.cookie("access_token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 3600000
            }).status(200).json(rest);
        });
    }
    catch (error){
        next(errorHandler(500, "Error signing in"));
    }
};