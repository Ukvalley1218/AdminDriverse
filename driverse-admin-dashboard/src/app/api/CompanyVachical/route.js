import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Your backend API URL
console.log(BASE_URL)
export async function GET(request) {
  try {
    // Get the URL search params
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 10;
    const search = searchParams.get('search') || '';
    const vehicleType = searchParams.get('vehicleType')||'';
    const fromDate = searchParams.get('fromDate')|| '';
    const toDate = searchParams.get('toDate')|| '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Build query string
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(vehicleType && { vehicleType }),
      ...(fromDate && { fromDate }),
      ...(toDate && { toDate }),
      sortBy,
      order
    });

    // Make request to backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/getAllUserVehicles?${queryParams}`);

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || 'Failed to fetch vehicles' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy API Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Handle POST requests for creating vehicles

