// app/api/proxy/calls/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 10;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/getUserCallDetails?page=${page}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch call details');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch call details' },
            { status: 500 }
        );
    }
}