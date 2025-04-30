import mongoose from 'mongoose';

const truckDetailsSchema = new mongoose.Schema({
    modal: {
        type: String,
        required: true,
        trim: true,
    },
    make: {
        type: String,
        required: true,
        trim: true,
    },
    year: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});


const truck_details = mongoose.models.truck_details || mongoose.model('truck_details', truckDetailsSchema);


export default truck_details;
