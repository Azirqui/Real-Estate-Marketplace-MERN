import User from "../models/user.model.js"
import bcrypt from "bcrypt";

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
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                }
            }, { new: true });
            const { password, ...rest } = updatedUser;
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
