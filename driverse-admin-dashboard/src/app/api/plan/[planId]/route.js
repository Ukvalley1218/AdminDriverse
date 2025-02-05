import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
    try {
        const { planId } = params;
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/planupdate/${planId}`;
        const body = await req.json();

        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Failed to update plan');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating plan:', error);
        return NextResponse.json(
            { error: 'Failed to update plan', details: error.message },
            { status: 500 }
        );
    }
}



export async function DELETE(req, { params }) {
    try {
        const { planId } = params;
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/plandelete/${planId}`;

        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete plan');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error deleting plan:', error);
        return NextResponse.json(
            { error: 'Failed to delete plan', details: error.message },
            { status: 500 }
        );
    }
}