import { createRequire } from 'module';
import dayjs from 'dayjs';

import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

//days before renewal to send reminders
const REMINDERS = [7, 5, 3, 1];

// Workflow function to send Reminders
export const sendReminders = serve( async (context) => {
    //get subscription
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    //check if active
    if(!subscription || subscription.status !== 'active') return;

    //get renewal date of subscription
    const renewalDate = dayjs(subscription.renewalDate);

    //check if renewal date has passed
    if(renewalDate.isBefore(dayjs())){
        console.log(`Renewal date has past for ${subscriptionId}. Stopping workflow.`);
        return;
    }

    //Loop through reminder dates to sleep or trigger
    for(const daysBefore of REMINDERS){
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        //check if reminder is ... many days before renewal
        if(reminderDate.isAfter(dayjs())){
           await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }

        //trigger reminder
        if(dayjs().isSame(reminderDate, 'day')){
        await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }

        
    }
});

//Helper functions
//function to fetch subscription
const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
}

//funciton to sleep untill reminder
const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}}`);
    await context.sleepUntil(label, date.toDate());
}

//frunction to trigger reminder
const triggerReminder = async (context, label, subscription) => {
     return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);
        
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        })
    });
}

