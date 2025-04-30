import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json(); // Parse request body
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/DynamicChages`, {
            method: "POST",
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
