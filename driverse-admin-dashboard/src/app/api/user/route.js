// pages/api/proxy/users.js
import { NextResponse } from 'next/server';

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const page = searchParams.get('page') || 1;
    const serviceType = searchParams.get('serviceType')||'';

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/getAllUsers?search=${search}&startDate=${startDate}&endDate=${endDate}&page=${page}&serviceType=${serviceType}`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}