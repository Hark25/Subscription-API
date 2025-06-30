import User from '../models/user.model.js';

export const getUsers = async(req, res, next) => {
    try{
        //get user
        const users = await User.find();

        res.status(200).json({ success: true, data: users});
    }catch(error){
        next(error);
    }
}

export const getUser = async(req, res, next) => {
    try{
        //get user
        const user = await User.findById(req.params.id).select('-password');
       
        if(!user){
            const error = new Error('user not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: user});
    }catch(error){
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async(req, res, next) => {
    try{
        //these are fields that can be updated
        const allowedUpdates = ['name', 'email'];
        const updates = {};

        //Get updatable fields from request body
        for(const key of allowedUpdates){``
            if(req.body[key] !== undefined){
                updates[key] = req.body[key];
            }
        }

        //if no field are provided to update then throw error
        if (Object.keys(updates).length === 0) {
            const error = new Error('No valid fields provided for update.');
            error.statusCode = 400;
            throw error;
        }
        //check if email already exists
        const existingUser = await user.findOne({ email: updates.email });

        if(existingUser){
            const error = new Error('Email already exists');
            error.statusCode = 409;
            throw error;
        }

        //update user
        const user = await User.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        }).select('-password');

        //if user does not exist then throw error
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

         res.status(200).json({ success: true, data: user });
    }catch(error){
        next(error);
    }
}
