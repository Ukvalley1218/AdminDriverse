// app/api/proxy/kyc/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Get query parameters from the URL
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Construct the API URL with query parameters
    const queryParams = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add optional date parameters if they exist
    if (fromDate) queryParams.append('fromDate', fromDate);
    if (toDate) queryParams.append('toDate', toDate);

    // Make the request to your backend API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Agent_getAllUserKYC?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if needed (e.g., authorization)
          // 'Authorization': `Bearer ${token}`
        },
      }
    );

    if (!response.ok) {
      // Get error details from the response if available
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch {
        errorDetails = { message: `HTTP error! status: ${response.status}` };
      }
      
      throw new Error(errorDetails.message || `API request failed with status ${response.status}`);
    }

    // Parse and return the response data
    const data = await response.json();
    
    return NextResponse.json({
      totalRecords: data.totalRecords,
      verifiedCount: data.verifiedCount,
      unverifiedCount: data.unverifiedCount,
      data: data.data,
    });

  } catch (error) {
    console.error('Error fetching KYC data:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch KYC data', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}