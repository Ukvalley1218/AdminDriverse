import { NextResponse } from 'next/server';


export async function GET(req, { params }) {
    try {
        const { id } = params;

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/getUserAnalytics1/${id}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching user details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user details', details: error.message },
            { status: 500 }
        );
    }
}
