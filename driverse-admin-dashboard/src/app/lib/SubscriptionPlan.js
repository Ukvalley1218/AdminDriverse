import mongoose from 'mongoose';
const { Schema } = mongoose;

const subscriptionPlanSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    minutes: {
        type: Number,
        required: true,
    },
    recharges: [
        {

            hours: {
                type: Number,
            },
            minutes: {
                type: Number,
            },
            price: {
                type: Number,
            },
            costPerHour: {
                type: Number,

            },
            costPerMinute: {
                type: Number,

            },
            state: {
                type: String,
            },
            rechargeDate: {
                type: Date
            },
            planid: {
                type: String,

            }
        },
    ],
    deductions: [
        {
            minutes: {
                type: Number,
                required: true,
            },
            reason: {
                type: String,
                required: true,
            },
            transactionId: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],

}, { timestamps: true });



const SubscriptionPlan = mongoose.models.SubscriptionPlan || mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
export default SubscriptionPlan;

