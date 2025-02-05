// app/api/proxy/carrier-mech/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  
  // Extract query parameters
  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  const search = searchParams.get('search') || '';
  const fromDate = searchParams.get('fromDate') || '';
  const toDate = searchParams.get('toDate') || '';

  // Build query parameters
  const queryParams = new URLSearchParams({
    page,
    limit,
    sort,
    order,
    search,
    fromDate,
    toDate
  }).toString();

  // Using the correct endpoint
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Carrier-mech?${queryParams}`;
  
  console.log('Fetching from URL:', apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API responded with status: ${response.status}. Details: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching mechanic requests:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}