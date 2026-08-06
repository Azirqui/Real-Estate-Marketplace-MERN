import User from "../models/user.model.js"
import Listing from "../models/listing.model.js"
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
    res.json({
        message: 'Hello World!',
    })
};

export const updateUser = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) return res.status(401).json({ message: 'You can only update your own account!' });
        try {
            if (req.body.password) {
                req.body.password = bcrypt.hashSync(req.body.password, 10);
            }
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        ...(req.body.username && { username: req.body.username }),
                        ...(req.body.email && { email: req.body.email }),
                        ...(req.body.password && { password: req.body.password }),
                        ...(req.body.avatar && { avatar: req.body.avatar }),
                    },
                },
                { new: true }
            );
            const { password, ...rest } = updatedUser._doc;
            res.status(200).json(rest);

        } catch (err) {
            next(err);
        }
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async(req, res, next) => {
    try{
        if(req.user.id !== req.params.id) return res.status(401).json({ message: 'You can only delete your own account!' });
        try{
            await User.findByIdAndDelete(req.params.id);
            res.clearCookie('access_token');
            res.status(200).json({ message: 'User deleted successfully!' });
        }catch(err){
            next(err);
        }
    }catch(error){
        next(error);
    }
}
export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};