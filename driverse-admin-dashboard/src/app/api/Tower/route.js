// app/api/proxy/tow/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get('page') || 1;
  const search = searchParams.get('search') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/getAllTowPosts?page=${page}&search=${search}&startDate=${startDate}&endDate=${endDate}`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}