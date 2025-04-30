// app/api/proxy/withdrawal-requests/confirm-payment/route.js
import { NextResponse } from 'next/server';

// Define allowed methods
const allowedMethods = ['POST'];

// Handle all HTTP methods
export async function POST(req) {
    try {
        const body = await req.json();
        const { requestId, status, remarks } = body;

        // Input validation
        if (!requestId || !status) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Request ID and status are required'
                },
                { status: 400 }
            );
        }

        // Validate status
        if (!['APPROVED', 'REJECTED', 'COMPLETED'].includes(status)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid status. Must be APPROVED, REJECTED, or COMPLETED'
                },
                { status: 400 }
            );
        }

        // Make request to backend API
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/confirmPayment`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestId,
                    status,
                    remarks
                }),
            }
        );

        if (!response.ok) {
            let errorDetails;
            try {
                errorDetails = await response.json();
            } catch {
                errorDetails = { message: `HTTP error! status: ${response.status}` };
            }

            return NextResponse.json(
                {
                    success: false,
                    message: errorDetails.message || `Payment confirmation failed with status ${response.status}`
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            message: data.message,
            data: {
                requestId: data.data.requestId,
                status: data.data.status,
                processedDate: data.data.processedDate,
                completedDate: data.data.completedDate,
                remarks: data.data.remarks,
                availableBalance: data.data.availableBalance,
                pendingBalance: data.data.pendingBalance,
                totalBalance: data.data.totalBalance,
                agentDetails: data.data.agentDetails
            }
        });

    } catch (error) {
        console.error('Payment confirmation error:', error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

// Handle unsupported methods
export async function GET(req) {
    return methodNotAllowed();
}

export async function PUT(req) {
    return methodNotAllowed();
}

export async function DELETE(req) {
    return methodNotAllowed();
}

export async function PATCH(req) {
    return methodNotAllowed();
}

// Helper function for method not allowed response
function methodNotAllowed() {
    return NextResponse.json(
        {
            success: false,
            message: 'Method not allowed. Only POST requests are supported.'
        },
        {
            status: 405,
            headers: {
                'Allow': allowedMethods.join(', ')
            }
        }
    );
}
