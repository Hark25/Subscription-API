import Subscription from "../models/subscription.model.js";
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async(req, res, next) => {
    try{
        const subscription = await Subscription.create({
            ... req.body,
            user: req.user._id, //comes from auth middleware
        });

        //trigger workflow to send reminders
        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        })

        res.status(201).json({ success: true, data: {subscription, workflowRunId}});
    }catch(error){
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) =>{
    try{
        if(req.user.id !== req.params.id){
            const error = new Error("you are not the owner of this account");
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscriptions });

    }catch(error){
        next(error);
    }
}

export const getAllSubscriptions = async (req, res, next) =>{
    try{
        const subscriptions = await Subscription.find();

        res.status(200).json({ success: true, data: subscriptions});

    }catch(error){
        next(error);
    }
}

export const getSubscriptionById = async (req, res, next) => {
    try{
        const subscription = await Subscription.findById(req.params.id);

        if(!subscription){
            const error = new Error("Subscription not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: subscription });
    }catch(error){
        next(error);
    }
}

export const updateSubscription = async (req, res, next) => {
    try{
        const allowedUpdates = ['name', 'price','currency', 'frequency', 'category', 'paymentMethod'];
        const updates = {};

        //Get updatable fields from request body
        for(const key of allowedUpdates){
            if(req.body[key] !== undefined){
                updates[key] = req.body[key];
            }
        }

        //check if no field are provided to update then throw error
        if (Object.keys(updates).length === 0) {
            const error = new Error('No valid fields provided for update.');
            error.statusCode = 400;
            throw error;
        }

        //check if subscription exists
        const subscription = await Subscription.findById(req.params.id);

        if(!subscription){
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        //update subscription
        const updatedSubscription = await Subscription.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: updatedSubscription });
    }catch(error){
        next(error);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try{
        const subscription = await Subscription.findByIdAndDelete(req.params.id);

        if(!subscription){
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, message: 'Subcription deleted Successfully'});
    }catch(error){
        next(error);
    }
}

export const cancelSubcription = async (req, res, next) => {
    try{

        const subscription = await Subscription.findByIdAndUpdate(req.params.id, {status: 'cancelled'}, {
            new: true,
            runValidators: true,
        });

        if(!subscription){
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: subscription });
    }catch(error){
        next(error);
    }
}