import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeFrame = searchParams.get('timeFrame');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const download = searchParams.get('download');

    // Construct query parameters
    const queryParams = new URLSearchParams();
    if (timeFrame) queryParams.append('timeFrame', timeFrame);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (download) queryParams.append('download', download);

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/getUserStatsAndRecentSubscriptions?${queryParams.toString()}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': download === 'true' ? 'text/csv' : 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Handle CSV download
    if (download === 'true') {
      const csvData = await response.text();
      const filename = `subscription-stats-${timeFrame || 'all-time'}-${new Date().toISOString().slice(0, 10)}.csv`;
      
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=${filename}`,
        },
      });
    }

    // Handle JSON response
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}