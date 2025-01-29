// app/api/proxy/kyc/verify/[userId]/route.js
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  const { userId } = params;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/verifyKYC/${userId}`,
      {
        method: 'PUT'
      }
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify KYC' }, { status: 500 });
  }
}