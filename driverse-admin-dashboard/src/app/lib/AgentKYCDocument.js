import mongoose from 'mongoose';

// Document verification sub-schema
const VerificationSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    verifiedAt: Date,
    rejectionReason: String,
    notes: String
}, { _id: false });

// Document sub-schema
const DocumentSchema = new mongoose.Schema({
    url: String,
    public_id: String,
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    verification: {
        type: VerificationSchema,
        default: () => ({})
    }
}, { _id: false });

// Country document requirements configuration
const countryRequirements = {
    IN: {
        documents: [
            { key: 'aadhar', label: 'Aadhaar Card', required: true },
            { key: 'pan', label: 'PAN Card', required: true },
            { key: 'bank', label: 'Bank Passbook', required: true },
            { key: 'photo', label: 'Passport Photo', required: true }
        ]
    },
    US: {
        documents: [
            { key: 'ssn', label: 'Social Security Number', required: true },
            { key: 'id', label: 'Government Issued ID', required: true },
            { key: 'proof_of_address', label: 'Proof of Address', required: true },
            { key: 'photo', label: 'Passport Photo', required: true }
        ]
    },
    CA: {
        documents: [
            { key: 'sin', label: 'SIN Number', required: true },
            { key: 'id', label: 'Government Issued ID', required: true },
            { key: 'proof_of_address', label: 'Proof of Address', required: true },
            { key: 'photo', label: 'Passport Photo', required: true }
        ]
    },
    GB: {
        documents: [
            { key: 'ni', label: 'National Insurance Number', required: true },
            { key: 'id', label: 'Government Issued ID', required: true },
            { key: 'proof_of_address', label: 'Proof of Address', required: true },
            { key: 'photo', label: 'Passport Photo', required: true }
        ]
    },
    AE: {
        documents: [
            { key: 'emirates_id', label: 'Emirates ID', required: true },
            { key: 'passport', label: 'Passport Copy', required: true },
            { key: 'visa', label: 'Visa Copy', required: true },
            { key: 'photo', label: 'Passport Photo', required: true }
        ]
    },
    default: {
        documents: [
            { key: 'national_id', label: 'National ID', required: true },
            { key: 'proof_of_address', label: 'Proof of Address', required: true },
            { key: 'tax_id', label: 'Tax Identification Number', required: false },
            { key: 'photo', label: 'Passport Photo', required: true }
        ]
    }
};

// Main KYC Schema
const AgentKYCSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    country: {
        type: String,
        required: true,
        uppercase: true,
        enum: ['IN', 'US', 'CA', 'GB', 'AE', 'OTHER'],
        default: 'OTHER'
    },
    documents: {
        type: Map,
        of: DocumentSchema,
        default: () => ({})
    },
    overallStatus: {
        type: String,
        enum: ['not_submitted', 'pending', 'approved', 'rejected', 'partially_approved'],
        default: 'not_submitted'
    },
    lastVerifiedAt: Date
}, { timestamps: true });

// Get requirements for current country
AgentKYCSchema.methods.getCountryRequirements = function () {
    return countryRequirements[this.country] || countryRequirements.default;
};

// Validate required documents before save
AgentKYCSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('country') || this.isModified('documents')) {
        const requirements = this.getCountryRequirements();
        const missingDocs = requirements.documents
            .filter(doc => doc.required)
            .filter(doc => !this.documents.has(doc.key) || !this.documents.get(doc.key).url);

        if (missingDocs.length > 0) {
            return next(new Error(`Missing required documents: ${missingDocs.map(d => d.label).join(', ')}`));
        }
    }
    next();
});

// Verify a specific document
AgentKYCSchema.methods.verifyDocument = function (documentKey, options = {}) {
    if (!this.documents.has(documentKey)) {
        throw new Error(`Document ${documentKey} not found`);
    }

    const doc = this.documents.get(documentKey);
    doc.verification = {
        status: options.status || 'verified',
        verifiedAt: new Date(),
        rejectionReason: options.rejectionReason,
        notes: options.notes
    };

    this.updateOverallStatus();
    return this;
};

// Update overall verification status
AgentKYCSchema.methods.updateOverallStatus = function () {
    const requirements = this.getCountryRequirements();
    const requiredDocs = requirements.documents.filter(d => d.required);

    const verifiedDocs = requiredDocs.filter(d => {
        const doc = this.documents.get(d.key);
        return doc && doc.verification.status === 'verified';
    });

    const rejectedDocs = requiredDocs.filter(d => {
        const doc = this.documents.get(d.key);
        return doc && doc.verification.status === 'rejected';
    });

    if (verifiedDocs.length === requiredDocs.length) {
        this.overallStatus = 'approved';
    } else if (rejectedDocs.length > 0) {
        this.overallStatus = 'rejected';
    } else if (verifiedDocs.length > 0) {
        this.overallStatus = 'partially_approved';
    } else {
        this.overallStatus = 'pending';
    }

    this.lastVerifiedAt = new Date();
    return this;
};

// Get all documents with their status
AgentKYCSchema.methods.getDocumentStatus = function () {
    const requirements = this.getCountryRequirements();
    return requirements.documents.map(doc => {
        const documentData = this.documents.get(doc.key) || {};
        return {
            key: doc.key,
            label: doc.label,
            required: doc.required,
            url: documentData.url,
            status: documentData.verification?.status || 'pending',
            uploaded: !!documentData.url
        };
    });
};

const AgentKYCDocument = mongoose.models.AgentKYCDocument || mongoose.model('AgentKYCDocument', AgentKYCSchema);
export default AgentKYCDocument;