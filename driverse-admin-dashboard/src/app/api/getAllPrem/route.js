import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Get URL and search params
    const { searchParams } = new URL(req.url);

    // Extract all query parameters
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 10;
    const search = searchParams.get('search') || '';
    const fromDate = searchParams.get('fromDate') || '';
    const toDate = searchParams.get('toDate') || '';
    const serviceType = searchParams.get('serviceType') || '';
    const download = searchParams.get('download') === 'true';

    // Construct query parameters
    const queryParams = new URLSearchParams({
      page,
      limit,
      search,
      fromDate,
      toDate,
      serviceType,
      download
    }).toString();

    // Construct API URL with base URL from environment variable
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/getAllPremiumByserviceType?${queryParams}`;

    // Make request to backend API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any authorization headers if needed
        // 'Authorization': `Bearer ${token}`
      },
    });

    // Get response data
    const data = await response.json();

    // If it's a download request, handle differently
    if (download) {
      // Get the CSV data from the response
      const csvData = data;

      // Set appropriate headers for CSV download
      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=premium-users.csv'
        }
      });
    }

    // Return regular JSON response
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Route Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal Server Error',
        error: error.message 
      }, 
      { status: 500 }
    );
  }
}