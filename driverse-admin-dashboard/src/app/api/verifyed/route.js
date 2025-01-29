// app/api/proxy/kyc/verified/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/getAllVerifiedKYC`);
    if (!response.ok) {
      throw new Error('Failed to fetch KYC data');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch verified KYC data' }, { status: 500 });
  }
}