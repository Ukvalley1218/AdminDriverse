import mongoose from 'mongoose';
import { connectToDb } from '@/app/lib/db';
import PromoCodeModal from '@/app/lib/PromoCode ';
import { NextResponse } from 'next/server';


// Function to generate unique promo code

const generatePromoCode = async () => {
    const length = 8;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let promoCode;

    do {
        promoCode = Array.from({ length }, () => 
            characters[Math.floor(Math.random() * characters.length)]
        ).join('');
    } while (await PromoCodeModal.findOne({ PromoCode: promoCode }));

    return promoCode;
};

// GET all promo codes
export async function GET() {
    try {
        await connectToDb();
        const promoCodes = await PromoCodeModal.find({});
        
        return NextResponse.json({ 
            success: true, 
            message: "Promo codes retrieved successfully", 
            data: promoCodes 
        });
    } catch (error) {
        console.error("Error retrieving promo codes:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

// Create new promo code
export async function POST(request) {
    try {
        await connectToDb();
        const { validate } = await request.json();

        if (!validate) {
            return NextResponse.json(
                { success: false, message: "Validation field is required" },
                { status: 400 }
            );
        }

        const promoCodeValue = await generatePromoCode();

        const newPromoCode = new PromoCodeModal({ 
            PromoCode: promoCodeValue, 
            validate, 
            status: "Active" 
        });
        await newPromoCode.save();

        return NextResponse.json(
            { 
                success: true, 
                message: "Promo code created successfully", 
                data: {
                    PromoCode: promoCodeValue,
                    validate,
                    status: "Active"
                } 
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating promo code:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}