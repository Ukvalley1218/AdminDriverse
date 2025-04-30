import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Extract query parameters from the request
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    // Construct the API URL with query parameters
    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Agent_getAllVerifiedKYC`);
    
    // Add query parameters to the API URL
    if (search) apiUrl.searchParams.append('search', search);
    if (fromDate) apiUrl.searchParams.append('fromDate', fromDate);
    if (toDate) apiUrl.searchParams.append('toDate', toDate);
    apiUrl.searchParams.append('page', page);
    apiUrl.searchParams.append('limit', limit);

    console.log(`Fetching verified KYC data from: ${apiUrl.toString()}`);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 } // Cache the response for 60 seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Validate the response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from API');
    }

    console.log('Successfully fetched KYC data');
    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Error in GET /api/kyc:', error.message);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch verified KYC data'
    }, {
      status: 500
    });
  }
}