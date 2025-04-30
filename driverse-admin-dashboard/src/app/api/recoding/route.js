// app/api/audio/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // Get URL search params
        const { searchParams } = new URL(request.url);

        // Extract query parameters
        const userId = searchParams.get('userId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const fromDate = searchParams.get('fromDate');
        const toDate = searchParams.get('toDate');

        // Validate userId
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid or missing userId'
                },
                { status: 400 }
            );
        }

        // Build query parameters
        const queryParams = new URLSearchParams({
            userId,
            page: page.toString(),
            limit: limit.toString(),
        });

        if (fromDate) queryParams.append('fromDate', fromDate);
        if (toDate) queryParams.append('toDate', toDate);

        // Make request to your backend API
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/getUserAudioWithFilters?${queryParams.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    // Add any necessary authentication headers
                    'Authorization': request.headers.get('authorization') || '',
                },
            }
        );

        // Get the response data
        const data = await response.json();

        // If the backend request wasn't successful, return the error
        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || 'Error fetching audio records',
                },
                { status: response.status }
            );
        }

        // Return successful response
        return NextResponse.json(data);

    } catch (error) {
        console.error('Proxy API Error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error: error.message
            },
            { status: 500 }
        );
    }
}
