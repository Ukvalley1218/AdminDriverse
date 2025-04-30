import { NextResponse } from "next/server";
export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json(); // Parse request body

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/dynamic-charges/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = params;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/dynamic-charges/${id}`, {
            method: "DELETE",
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
