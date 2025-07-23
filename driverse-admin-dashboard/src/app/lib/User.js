import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { type } from "os";

const subscriptionHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  changedAt: { type: Date, default: Date.now },
  reason: { type: String }
}, { _id: false });

const activeSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  tokenHash: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ["authentication", "password_reset", "verification"],
    required: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    avatar: {
      url: { type: String, required: false },
      public_id: { type: String, required: false },
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    lastname:{
      type:String,
      require:true
      
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    HasUsedPromCode: {
      type: String,
      enum: ["used", 'notUsed'],
      default: 'notUsed'
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    companyAddress: {
      type: String,
      required: false,
    },
    serviceType: {
      type: String,
      enum: ["Driver", "Mechanic", "Tower", "Agent", "Company"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    previousPasswords: [{
      type: String,
      select: false
    }],
    deviceToken: {
      type: String
    },
    isValidUser: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    otpHash: {
      type: String,
      select: false
    },
    otpExpires: {
      type: Date,
      select: false
    },
    otpAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    otpLockedUntil: {
      type: Date,
      select: false
    },
    activeSessions: {
      type: [activeSessionSchema],
      select: false,
      default: []
    },
    stripeCustomerId: {
      type: String
    },
    subscriptionId: {
      type: String
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "expired", "pending", "canceled"],
      default: "inactive"
    },
    status: {
      type: String,
      enum: ["Online", "offline", "Busy"],
      default: "offline",
      index: true
    },
    lastSeen: {
      type: Date,
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    subscriptionHistory: [subscriptionHistorySchema],
    refreshToken: {
      type: String,
      select: false
    },
    verificationToken: {
      type: String,
      select: false
    },
    verificationTokenExpiry: {
      type: Date,
      select: false
    },
    lastPasswordChange: {
      type: Date,
      default: Date.now
    },
    lastLogin: {
      type: Date
    },
    lastFailedLogin: {
      type: Date
    },
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    isMarkedForDeletion: {
      type: Boolean,
      default: false,
      select: false
    },
    deletionScheduledAt: {
      type: Date,
      select: false
    },
    deletionReason: {
      type: String,
      select: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.previousPasswords;
        delete ret.otpHash;
        delete ret.refreshToken;
        delete ret.verificationToken;
        delete ret.activeSessions;
        return ret;
      }
    }
  }
);

// Indexes
userSchema.index({ email: 1, phone: 1 });
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ "activeSessions.sessionId": 1 });

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    this.lastPasswordChange = new Date();
    this.previousPasswords = [...(this.previousPasswords || []), this.password].slice(-5);
    next();
  } catch (err) {
    next(err);
  }
});

/* ======================
   SESSION MANAGEMENT
   ====================== */

/**
 * Creates a new session token for the user
 * @param {Object} req - Express request object
 * @param {String} [sessionType="authentication"] - Type of session
 * @returns {Object} Contains sessionToken, sessionId and expiresAt
 */
userSchema.methods.createSessionToken = async function (req, sessionType = "authentication") {
  if (!process.env.SESSION_SALT) {
    throw new Error("SESSION_SALT environment variable is not set");
  }

  const sessionId = crypto.randomBytes(16).toString('hex');
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const hashInput = `${sessionToken}:${sessionId}:${process.env.SESSION_SALT}`;
  const tokenHash = await bcrypt.hash(hashInput, 12);

  const sessionDuration = sessionType === "password_reset"
    ? 15 * 60 * 1000 // 15 minutes for password reset
    : 7 * 24 * 60 * 60 * 1000; // 7 days for other sessions

  const newSession = {
    sessionId,
    tokenHash,
    ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'] || 'unknown',
    expiresAt: new Date(Date.now() + sessionDuration),
    type: sessionType
  };

  // Update user with new session
  const updatedUser = await this.constructor.findByIdAndUpdate(
    this._id,
    { $push: { activeSessions: newSession } },
    { new: true, select: '+activeSessions' }
  );

  if (!updatedUser) {
    throw new Error("Failed to create session - user not found");
  }

  return {
    sessionToken,
    sessionId,
    expiresAt: newSession.expiresAt
  };
};

/**
 * Verifies a session token
 * @param {String} sessionToken - The session token to verify
 * @param {String} sessionId - The session ID
 * @returns {Object} Verification result with isValid flag and session details if valid
 */
userSchema.methods.verifySessionToken = async function (sessionToken, sessionId) {
  if (!process.env.SESSION_SALT) {
    console.error('SESSION_SALT environment variable is not set');
    return { isValid: false, reason: "Server configuration error" };
  }

  if (!sessionToken || !sessionId) {
    return { isValid: false, reason: "No session token or ID provided" };
  }

  // Find user with active sessions
  const user = await this.constructor.findOne({ _id: this._id })
    .select('+activeSessions')
    .lean();

  if (!user) {
    return { isValid: false, reason: "User not found" };
  }

  const now = new Date();
  const session = user.activeSessions.find(s => 
    s.sessionId === sessionId && s.expiresAt > now
  );

  if (!session) {
    return { isValid: false, reason: "Session not found or expired" };
  }

  try {
    const hashInput = `${sessionToken}:${sessionId}:${process.env.SESSION_SALT}`;
    const isMatch = await bcrypt.compare(hashInput, session.tokenHash);

    if (isMatch) {
      // Update last activity (atomic update)
      await this.constructor.updateOne(
        { _id: this._id, "activeSessions.sessionId": sessionId },
        { $set: { "activeSessions.$.lastActivity": new Date() } }
      );

      return {
        isValid: true,
        session: {
          sessionId: session.sessionId,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          createdAt: session.createdAt,
          expiresAt: session.expiresAt,
          type: session.type,
          lastActivity: new Date() // Updated activity
        }
      };
    }
    
    return { isValid: false, reason: "Invalid session token" };
  } catch (err) {
    console.error('Session verification error:', err);
    return { isValid: false, reason: "Error verifying session" };
  }
};

/**
 * Invalidates a specific session
 * @param {String} sessionId - The session ID to invalidate
 */
userSchema.methods.invalidateSession = async function (sessionId) {
  await this.constructor.updateOne(
    { _id: this._id },
    { $pull: { activeSessions: { sessionId } } }
  );
};

/**
 * Invalidates all active sessions for the user
 */
userSchema.methods.invalidateAllSessions = async function () {
  await this.constructor.updateOne(
    { _id: this._id },
    { 
      $set: { activeSessions: [] },
      $unset: { refreshToken: "" } 
    }
  );
};

/**
 * Cleans up expired sessions
 */
userSchema.methods.cleanExpiredSessions = async function () {
  const now = new Date();
  await this.constructor.updateOne(
    { _id: this._id },
    { $pull: { activeSessions: { expiresAt: { $lte: now } } } }
  );
};

/* ======================
   PASSWORD MANAGEMENT
   ====================== */

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.isPreviousPassword = async function (newPassword) {
  for (const oldPassword of this.previousPasswords || []) {
    if (await bcrypt.compare(newPassword, oldPassword)) {
      return true;
    }
  }
  return false;
};

/* ======================
   TOKEN GENERATION
   ====================== */

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      serviceType: this.serviceType,
    },
    process.env.ACCESS_TOKEN_SECRET,
  );
};

userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
  );
  this.refreshToken = refreshToken;
  return refreshToken;
};

/* ======================
   DELETION PROTECTION
   ====================== */

userSchema.methods.softDelete = async function (reason = "User requested deletion") {
  this.isMarkedForDeletion = true;
  this.deletionScheduledAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  this.deletionReason = reason;
  await this.invalidateAllSessions();
  await this.save();
};

userSchema.methods.cancelDeletion = async function () {
  this.isMarkedForDeletion = false;
  this.deletionScheduledAt = undefined;
  this.deletionReason = undefined;
  await this.save();
};

userSchema.pre(['deleteOne', 'deleteMany', 'findOneAndDelete'], async function (next) {
  const query = this.getQuery();
  const user = await this.model.findOne(query);
  
  if (user && !user.isMarkedForDeletion) {
    throw new Error('User must be marked for deletion before being removed. Use softDelete() first.');
  }
  next();
});

userSchema.statics.hardDeleteMarkedUsers = async function () {
  const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
  return this.deleteMany({
    isMarkedForDeletion: true,
    deletionScheduledAt: { $lte: new Date() }
  });
};

userSchema.statics.findMarkedForDeletion = function () {
  return this.find({ isMarkedForDeletion: true });
};

userSchema.query.excludeMarkedForDeletion = function () {
  return this.where({ isMarkedForDeletion: { $ne: true } });
};

/* ======================
   HOOKS AND MIDDLEWARE
   ====================== */

// Last seen update
userSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "offline") {
    this.lastSeen = new Date();
  }
  next();
});

// Clean expired sessions on fetch
userSchema.post(/^find/, function (docs) {
  if (!Array.isArray(docs)) docs = [docs];
  for (const doc of docs) {
    if (doc?.activeSessions) {
      const now = new Date();
      doc.activeSessions = doc.activeSessions.filter(session => session.expiresAt > now);
    }
  }
});

// Apply the exclusion by default to all find queries
userSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeMarkedForDeletion) {
    this.excludeMarkedForDeletion();
  }
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;