// app/api/proxy/withdrawal-requests/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        // Get query parameters from the URL
        const searchParams = req.nextUrl.searchParams;
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';
        const fromDate = searchParams.get('fromDate');
        const toDate = searchParams.get('toDate');
        const username = searchParams.get('username');
        const status = searchParams.get('status');

        // Construct query parameters
        const queryParams = new URLSearchParams({
            page,
            limit,
        });

        // Add optional parameters if they exist
        if (fromDate) queryParams.append('fromDate', fromDate);
        if (toDate) queryParams.append('toDate', toDate);
        if (username) queryParams.append('username', username);
        if (status) queryParams.append('status', status);

        // Make request to backend API
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/getWithdrawalRequests?${queryParams.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            let errorDetails;
            try {
                errorDetails = await response.json();
            } catch {
                errorDetails = { message: `HTTP error! status: ${response.status}` };
            }
            throw new Error(errorDetails.message || `API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Return response in the same structure as the original controller
        return NextResponse.json({
            success: true,
            data: {
                requests: data.data.requests,
                pagination: {
                    total: data.data.pagination.total,
                    page: parseInt(page),
                    pages: data.data.pagination.pages,
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get withdrawal requests error:', error);

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