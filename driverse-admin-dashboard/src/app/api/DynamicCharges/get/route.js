import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // Extract search params from the request URL
        const { searchParams } = new URL(req.url);
        const serviceType = searchParams.get("serviceType") || "";

        // Construct API URL with query parameters if serviceType exists
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/getDynamicChages${serviceType ? `?serviceType=${serviceType}` : ""}`;

        // Fetch data from the backend
        const response = await fetch(url, { method: "GET" });

        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching dynamic charges:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
