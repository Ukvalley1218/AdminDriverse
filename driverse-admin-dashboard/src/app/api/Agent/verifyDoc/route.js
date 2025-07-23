import { NextResponse } from "next/server";
import { connectToDb } from "@/app/lib/db";
import AgentKYCDocument from "@/app/lib/AgentkycDocument";
import User from "@/app/lib/User";

export async function POST(request) {
    try {
        await connectToDb();

        const { userId, documentKey, status, rejectionReason, notes } = await request.json();

        if (!userId || !documentKey || !status) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Find the KYC document
        const kycDoc = await AgentKYCDocument.findOne({ userId });

        if (!kycDoc) {
            return NextResponse.json(
                { success: false, message: 'KYC document not found for this user' },
                { status: 404 }
            );
        }

        // Verify the specific document
        kycDoc.verifyDocument(documentKey, {
            status,
            rejectionReason,
            notes
        });

        // Save the document to trigger the pre-save hook and update overall status
        await kycDoc.save();

        // Get updated status of all documents
        const documentStatus = kycDoc.getDocumentStatus();
        const requirements = kycDoc.getCountryRequirements();
        const requiredDocs = requirements.documents.filter(d => d.required);

        // Check if all required documents are verified
        const allVerified = requiredDocs.every(doc => {
            const docStatus = documentStatus.find(d => d.key === doc.key);
            return docStatus?.status === 'verified';
        });

        // Update overall status if all documents are verified
        if (allVerified) {
            kycDoc.overallStatus = 'approved';
            kycDoc.lastVerifiedAt = new Date();
            await kycDoc.save();
        }

        return NextResponse.json({
            success: true,
            data: {
                document: kycDoc.documents.get(documentKey),
                overallStatus: kycDoc.overallStatus,
                documentStatus: kycDoc.getDocumentStatus()
            },
            message: 'Document verification status updated'
        });
    } catch (error) {
        console.error('Error verifying document:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}