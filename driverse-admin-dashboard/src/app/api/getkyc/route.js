// app/api/proxy/kyc/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // const token = req.headers.get('authorization');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/getAllUserKYC`,
    //   {
    //     headers: {
    //       'Authorization': token
    //     }
    //   }
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch KYC data' }, { status: 500 });
  }
}