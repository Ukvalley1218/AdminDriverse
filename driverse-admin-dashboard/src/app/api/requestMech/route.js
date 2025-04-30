// app/api/UserRequestTow/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters with defaults
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 10;
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const search = searchParams.get('search') || '';
    const fromDate = searchParams.get('fromDate') || '';
    const toDate = searchParams.get('toDate') || '';

    // Handle serviceType as an array
    const serviceTypeParam = searchParams.get('serviceType');
    const serviceType = serviceTypeParam
      ? serviceTypeParam.split(',').map(type => type.trim())
      : [];

    // Build query string for backend
    const queryParams = new URLSearchParams({
      page,
      limit,
      sort,
      order,
      search,
      fromDate,
      toDate,
      serviceType: serviceType.join(',')
    }).toString();

    // Your backend API URL
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/requests?${queryParams}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any auth headers if needed
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log("data", data);

    if (!data.success) {
      return NextResponse.json(data, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in UserRequestTow API:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message
      },
      { status: 500 }
    );
  }
}