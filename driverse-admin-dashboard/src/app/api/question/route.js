import { connectToDb } from "@/app/lib/db";
import QA from "@/app/lib/QuestionSet";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectToDb();
        const qas = await QA.find().sort({ createdAt: -1 }); // Sort by newest first
        return NextResponse.json(qas);
    } catch (error) {
        console.error("Error fetching QAs:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST (create) a new QA
export async function POST(request) {
    try {
        await connectToDb();
        const { question, answers } = await request.json();

        if (!question || !answers || !Array.isArray(answers) || answers.length === 0) {
            return NextResponse.json(
                { error: "Question and at least one answer are required" },
                { status: 400 }
            );
        }

        const newQA = new QA({ question, answers });
        const savedQA = await newQA.save();
        return NextResponse.json(savedQA, { status: 201 });

    } catch (error) {
        console.error("Error creating QA:", error);
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT (update) a QA
export async function PUT(request) {
    try {
        await connectToDb();
        const { id, question, answers } = await request.json();

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Valid ID is required" },
                { status: 400 }
            );
        }

        if (!question || !answers || !Array.isArray(answers) || answers.length === 0) {
            return NextResponse.json(
                { error: "Question and at least one answer are required" },
                { status: 400 }
            );
        }

        const updatedQA = await QA.findByIdAndUpdate(
            id,
            { question, answers },
            { new: true, runValidators: true }
        );

        if (!updatedQA) {
            return NextResponse.json(
                { error: "QA not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedQA);

    } catch (error) {
        console.error("Error updating QA:", error);
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE a QA
export async function DELETE(request) {
    try {
        await connectToDb();
        const { id } = await request.json();

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Valid ID is required" },
                { status: 400 }
            );
        }

        const deletedQA = await QA.findByIdAndDelete(id);

        if (!deletedQA) {
            return NextResponse.json(
                { error: "QA not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "QA deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting QA:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}