import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    // Construct the API URL with query parameters
    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/getAllVerifiedKYC`);
    
    // Add query parameters to the API URL
    if (search) apiUrl.searchParams.append('search', search);
    if (fromDate) apiUrl.searchParams.append('fromDate', fromDate);
    if (toDate) apiUrl.searchParams.append('toDate', toDate);
    apiUrl.searchParams.append('page', page);
    apiUrl.searchParams.append('limit', limit);

    console.log('Fetching KYC data from:', apiUrl.toString());

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Ensure fresh data
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from API');
    }

    // Transform data if needed
    const transformedData = {
      success: true,
      data: data.data || [],
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalRecords: data.totalRecords || 0,
        totalPages: data.totalPages || 1
      }
    };

    return NextResponse.json(transformedData);

  } catch (error) {
    console.error('Error in KYC API route:', error.message);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to fetch KYC data',
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          totalRecords: 0,
          totalPages: 1
        }
      },
      { status: 500 }
    );
  }
}