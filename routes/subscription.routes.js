import {Router} from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getAllSubscriptions, getUserSubscriptions, getSubscriptionById } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', getAllSubscriptions);
subscriptionRouter.get('/:id', getSubscriptionById);
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', (req, res) => res.send({title: 'UPDATE subscriptions'}));
subscriptionRouter.delete('/:id', (req, res) => res.send({title: 'DELETE subscriptions'}));
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);
subscriptionRouter.put('/:id/cancel', (req, res) => res.send({title: 'CANCEL subscriptions'}));
subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({title: 'GET upcoming renewals'}));

export default subscriptionRouter;
