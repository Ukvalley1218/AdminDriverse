import { NextResponse } from 'next/server';


export async function GET(req, { params }) {
    try {
        const { id } = params;

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/gusers/${id}`;

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




export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json();

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/gusers/${id}`;

        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Failed to update user');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user', details: error.message },
            { status: 500 }
        );
    }
}





export async function DELETE(req, { params }) {
    try {
        const { id } = params;

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/gusers/${id}`;

        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user', details: error.message },
            { status: 500 }
        );
    }
}




export async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json();

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/gusers/${id}/block`;

        const response = await fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Failed to block user');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error blocking user:', error);
        return NextResponse.json(
            { error: 'Failed to block user', details: error.message },
            { status: 500 }
        );
    }
}