import { NextResponse } from "next/server";
import { connectToDb } from "@/app/lib/db";
import AgentKYCDocument from "@/app/lib/AgentkycDocument";
import mongoose from "mongoose";

export async function GET(request) {
    try {
        await connectToDb();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const email = searchParams.get('email') || '';
        const fromDate = searchParams.get('fromDate');
        const toDate = searchParams.get('toDate');
        const download = searchParams.get('download') === 'true';

        // Build the query
        let query = {};

        // Search by email
        if (email) {
            const users = await mongoose.model('User').find(
                { email: { $regex: email, $options: 'i' } },
                '_id'
            ).lean();

            if (users.length > 0) {
                query.userId = { $in: users.map(u => u._id) };
            } else {
                // Return empty if no users found with this email
                return NextResponse.json({
                    success: true,
                    data: [],
                    pagination: {
                        page,
                        limit,
                        total: 0,
                        totalPages: 0,
                    }
                });
            }
        }

        // Date range filtering
        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) {
                query.createdAt.$gte = new Date(fromDate);
            }
            if (toDate) {
                query.createdAt.$lte = new Date(toDate + 'T23:59:59.999Z');
            }
        }

        // Get total count for pagination
        const total = await AgentKYCDocument.countDocuments(query);

        // Find documents with pagination
        let documents = await AgentKYCDocument.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('userId', 'email') // Populate user details
            .lean();

        // If downloading, return all records without pagination
        if (download) {
            documents = await AgentKYCDocument.find(query)
                .populate('userId', 'email')
                .lean();

            return NextResponse.json({
                success: true,
                data: documents,
                pagination: {
                    page: 1,
                    limit: total,
                    total,
                    totalPages: 1,
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: documents,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.error('Error fetching documents:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}