// app/api/assignSubscription/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            userId,
            paymentId,
            amountReceived,
            currency,
            subscriptionDuration,
            subscriptionStatus = "active"
        } = body;

        // Input validation
        if (!userId || !paymentId || !amountReceived || !currency || !subscriptionDuration) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields",
                    requiredFields: ['userId', 'paymentId', 'amountReceived', 'currency', 'subscriptionDuration']
                },
                { status: 400 }
            );
        }

        // Validate amount and duration
        if (amountReceived <= 0 || subscriptionDuration <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Amount and duration must be positive numbers"
                },
                { status: 400 }
            );
        }

        // Get authorization header
        const authHeader = request.headers.get('authorization') || '';

        // Make request to backend API
        const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/assignSubscription`;
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify({
                userId,
                paymentId,
                amountReceived,
                currency,
                subscriptionDuration,
                subscriptionStatus
            })
        });

        const data = await response.json();

        // Check if the backend request was successful
        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || 'Backend service error',
                    error: data.error
                },
                { status: response.status }
            );
        }

        // Return successful response
        return NextResponse.json({
            success: true,
            message: "Subscription assigned successfully",
            data: data.data
        });

    } catch (error) {
        // Log error for debugging
        if (process.env.NODE_ENV === 'development') {
            console.error('Subscription assignment error:', error);
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}

// Handle other HTTP methods
export async function GET(request) {
    return NextResponse.json(
        {
            success: false,
            message: 'Method not allowed. Use POST instead.'
        },
        { status: 405 }
    );
}

export async function PUT(request) {
    return NextResponse.json(
        {
            success: false,
            message: 'Method not allowed. Use POST instead.'
        },
        { status: 405 }
    );
}

export async function DELETE(request) {
    return NextResponse.json(
        {
            success: false,
            message: 'Method not allowed. Use POST instead.'
        },
        { status: 405 }
    );
}