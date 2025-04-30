import mongoose from "mongoose";

const PromoCodeSchema = new mongoose.Schema({
    PromoCode: {
        type: String,
        require: true,
        unique: true,
    },
    validate: {
        type: String,
    },
    status: {
        type: String,
        enum: ["Active", "InActive"],
        default:'Active'
    }

})

const PromoCodeModal = mongoose.models.PromoCodeModal || mongoose.model('PromoCodeModal', PromoCodeSchema);
export default PromoCodeModal;