import { NextResponse } from 'next/server';

export async function POST(req) {
    const { searchParams } = new URL(req.url);

    // Extract query parameters
    const userId = searchParams.get('userId');
    const documentType = searchParams.get('documentType');

    // Validate required parameters
    if (!userId || !documentType) {
        return NextResponse.json(
            {
                success: false,
                message: 'Missing required parameters: userId and documentType are required'
            },
            { status: 400 }
        );
    }

    // Construct query parameters
    const queryParams = new URLSearchParams({
        userId,
        documentType
    }).toString();

    // Construct the API URL properly with query parameters
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Agent_verifyKycDocument?${queryParams}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',

            // Add body if needed
            // body: JSON.stringify({}),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                {
                    success: false,
                    message: errorData.message || 'API request failed'
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log("data", data);
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
                error: error.message
            },
            { status: 500 }
        );
    }
}

// Optional: Add other HTTP methods handling
export async function GET() {
    return NextResponse.json(
        { message: 'Method not allowed' },
        { status: 405 }
    );
} 