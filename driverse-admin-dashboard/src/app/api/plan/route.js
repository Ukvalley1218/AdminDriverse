import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/plans`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch plans');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching plans:', error);
        return NextResponse.json(
            { error: 'Failed to fetch plans', details: error.message },
            { status: 500 }
        );
    }
}


export async function POST(req) {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/plans`;
        const body = await req.json();

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Failed to create plan');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating plan:', error);
        return NextResponse.json(
            { error: 'Failed to create plan', details: error.message },
            { status: 500 }
        );
    }
}