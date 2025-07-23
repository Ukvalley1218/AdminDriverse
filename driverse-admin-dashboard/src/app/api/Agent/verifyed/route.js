import { NextResponse } from "next/server";
import { connectToDb } from "@/app/lib/db";
import AgentKYCDocument from "@/app/lib/AgentkycDocument";
import mongoose from "mongoose";
import User from "@/app/lib/User";

export async function GET(request) {
  try {
    await connectToDb();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const fromDate = searchParams.get('fromDate') || '';
    const toDate = searchParams.get('toDate') || '';

    let query = {
      overallStatus: { $in: ['approved', 'partially_approved'] }
    };

    // Search by user email (assuming userId is populated)
    if (search) {
      query['$or'] = [
        { 'userId.email': { $regex: search, $options: 'i' } },
        { 'userId.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (fromDate || toDate) {
      query.lastVerifiedAt = {};
      if (fromDate) query.lastVerifiedAt.$gte = new Date(fromDate);
      if (toDate) query.lastVerifiedAt.$lte = new Date(toDate);
    }

    const total = await AgentKYCDocument.countDocuments(query);

    const documents = await AgentKYCDocument.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'username email')
      .sort({ lastVerifiedAt: -1 })
      .lean();

    // Transform data for the frontend
    const transformedData = documents.map(doc => ({
      _id: doc._id,
      username: doc.userId?.name || 'N/A',
      email: doc.userId?.email || 'N/A',
      country: doc.country,
      overallStatus: doc.overallStatus,
      lastVerifiedAt: doc.lastVerifiedAt,
      documents: doc.documents
    }));

    return NextResponse.json({
      success: true,
      data: transformedData,
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit: limit
    });

  } catch (error) {
    console.error('Error fetching verified documents:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}