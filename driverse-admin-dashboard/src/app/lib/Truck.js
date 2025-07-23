import mongoose from 'mongoose';

const TruckSchema = new mongoose.Schema({
    modal: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
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


const Truck = mongoose.models.Truck || mongoose.model('Truck', TruckSchema);


export default Truck;

