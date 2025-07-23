import mongoose from 'mongoose';

const talkTimePlanSchema = new mongoose.Schema({

  hours: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  costPerHour: {
    type: Number,
    required: true,
  },
  costPerMinute: {
    type: Number,

  },
}, { timestamps: true });

// Pre-save hook to calculate costPerMinute
talkTimePlanSchema.pre('save', function (next) {
  this.costPerMinute = this.hours * 60; // Convert hourly cost to per minute cost
  next();
});




const TalkTimePlan = mongoose.models.TalkTimePlan || mongoose.model('TalkTimePlan', talkTimePlanSchema);
export default TalkTimePlan;

