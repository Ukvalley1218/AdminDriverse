import mongoose from 'mongoose';

const qaSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answers: {
        type: [String], // Array of answerss
        required: true,
        validate: [(val) => val.length > 0, 'At least one answer is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const QA = mongoose.models.QA || mongoose.model('QA', qaSchema);

export default QA;