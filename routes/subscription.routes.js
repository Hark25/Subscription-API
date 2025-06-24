import {Router} from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getAllSubscriptions, getUserSubscriptions, getSubscriptionById, updateSubscription, deleteSubscription, cancelSubcription } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', getAllSubscriptions);
subscriptionRouter.get('/:id', getSubscriptionById);
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', authorize, updateSubscription);
subscriptionRouter.delete('/:id', deleteSubscription);
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);
subscriptionRouter.put('/:id/cancel', authorize, cancelSubcription);
subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({title: 'GET upcoming renewals'})); //do this later

export default subscriptionRouter;
