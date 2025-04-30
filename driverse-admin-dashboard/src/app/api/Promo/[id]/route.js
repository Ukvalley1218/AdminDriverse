
import { connectToDb } from "@/app/lib/db";
import PromoCodeModal from "@/app/lib/PromoCode ";
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// GET single promo code
export async function GET(request, { params }) {
    try {
        await connectToDb();
        const { id } = params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid promo code ID" },
                { status: 400 }
            );
        }

        const promoCode = await PromoCodeModal.findById(id);
        
        if (!promoCode) {
            return NextResponse.json(
                { success: false, message: "Promo code not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ 
            success: true, 
            message: "Promo code retrieved successfully", 
            data: promoCode 
        });
    } catch (error) {
        console.error("Error retrieving promo code:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

// Update promo code
export async function PUT(request, { params }) {
    try {
        await connectToDb();
        const { id } = params;
        const { validate, status } = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid promo code ID" },
                { status: 400 }
            );
        }

        const promoCode = await PromoCodeModal.findById(id);
        if (!promoCode) {
            return NextResponse.json(
                { success: false, message: "Promo code not found" },
                { status: 404 }
            );
        }

        if (validate !== undefined) promoCode.validate = validate;
        if (status !== undefined) promoCode.status = status;

        await promoCode.save();

        return NextResponse.json({ 
            success: true, 
            message: "Promo code updated successfully", 
            data: promoCode 
        });
    } catch (error) {
        console.error("Error updating promo code:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

// Delete promo code
export async function DELETE(request, { params }) {
    try {
        await connectToDb();
        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid promo code ID" },
                { status: 400 }
            );
        }

        const promoCode = await PromoCodeModal.findByIdAndDelete(id);
        if (!promoCode) {
            return NextResponse.json(
                { success: false, message: "Promo code not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            message: "Promo code deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting promo code:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}