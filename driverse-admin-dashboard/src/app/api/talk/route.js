import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const page = searchParams.get('page') || 1;
        const limit = searchParams.get('limit') || 10;
        const fromDate = searchParams.get('fromDate') || '';
        const toDate = searchParams.get('toDate') || '';
        const status = searchParams.get('status') || '';
        const userId = searchParams.get('userId') || '';

        // Include all possible data from backend API
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/getCallLogsData?` +
            `page=${page}&limit=${limit}&fromDate=${fromDate}&toDate=${toDate}&status=${status}&userId=${userId}` +
            `&includeTotalDuration=true&includeStatusCounts=true&includePaginatedLogs=true`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch call details');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching call details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch call details', details: error.message },
            { status: 500 }
        );
    }
}
