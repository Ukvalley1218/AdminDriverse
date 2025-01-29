import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
      trim: true,
    },
    LastName: {
      type: String,
      required: true,
      trim: true,
    },
    userType: {
      type: String,
      enum: ['Admin'],
      default: 'Admin',
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    refreshToken: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);



//
// Clear the model cache if it exists
if (mongoose.models && mongoose.models.Admin) {
  delete mongoose.models.Admin;
}

// Method to generate access token
adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      phone: this.phone, // Changed from username to phone
      userType: this.userType,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' // Use environment variable or default to 1 day
    }
  );
};

// Method to generate refresh token
adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      userType: this.userType,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '10d' // Use environment variable or default to 10 days
    }
  );
};// Clear the model cache if it exists
if (mongoose.models.Admin) {
  delete mongoose.models.Admin;
}




const AdminModel = mongoose.model('Admin', adminSchema);

export default AdminModel;
