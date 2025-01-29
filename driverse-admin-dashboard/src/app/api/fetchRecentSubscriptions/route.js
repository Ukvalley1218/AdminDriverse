// app/api/proxy/dashboard/subscriptions/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 5;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/fetchRecentSubscriptions?page=${page}&limit=${limit}`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}