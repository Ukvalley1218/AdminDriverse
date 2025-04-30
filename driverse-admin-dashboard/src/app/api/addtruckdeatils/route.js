import { NextResponse } from "next/server";
import { connectToDb } from "../../lib/db"
import truck_details from "../../lib/truck_details"
import csv from 'csv-parser';
import { Readable } from 'stream';

// Helper function to process CSV
const processCSV = async (fileData) => {
    const results = [];
    console.log("Processing CSV data...");
    const stream = Readable.from(fileData);

    return new Promise((resolve, reject) => {
        stream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
    console.log("CSV data processed successfully.");
};

// GET all trucks with pagination
export async function GET(request) {
    try {
        await connectToDb();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 5;
        const skip = (page - 1) * limit;

        const total = await truck_details.countDocuments({});
        const trucks = await truck_details.find({})
            .skip(skip)
            .limit(limit)
            .exec();

        return NextResponse.json({
            data: trucks,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching trucks", error: error.message },
            { status: 500 }
        );
    }
}

// POST - Create new truck or upload CSV
export async function POST(request) {
    try {
        await connectToDb();
        const contentType = request.headers.get('content-type');

        // Handle CSV upload
        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file');

            if (!file) {
                return NextResponse.json(
                    { message: "No file uploaded" },
                    { status: 400 }
                );
            }

            const fileData = await file.arrayBuffer();
            const fileBuffer = Buffer.from(fileData);
            const trucksData = await processCSV(fileBuffer);

            let importedCount = 0;
            const results = [];

            for (const truckData of trucksData) {
                const { model, make, year } = truckData;

                if (!model || !make || !year) {
                    continue;
                }

                // Check if truck exists
                const existingTruck = await truck_details.findOne({ modal: model, make, year: parseInt(year) });

                if (!existingTruck) {
                    const newTruck = new truck_details({
                        modal: model,
                        make,
                        year: parseInt(year)
                    });
                    await newTruck.save();
                    importedCount++;
                    results.push(newTruck);
                }
            }

            return NextResponse.json(
                {
                    message: "CSV processed successfully",
                    imported: importedCount,
                    results
                },
                { status: 200 }
            );
        }

        // Handle regular JSON truck creation
        const jsonData = await request.json();
        const { model, make, year } = jsonData;

        if (!model || !make || !year) {
            return NextResponse.json(
                { message: "Model, make, and year are required" },
                { status: 400 }
            );
        }

        const newTruck = new truck_details({ modal: model, make, year: parseInt(year) });
        await newTruck.save();

        return NextResponse.json(
            { message: "Truck created successfully", truck: newTruck },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error creating truck", error: error.message },
            { status: 500 }
        );
    }
}

// PUT - Update a truck
export async function PUT(request) {
    try {
        await connectToDb();
        const { id, model, make, year } = await request.json();

        if (!id) {
            return NextResponse.json(
                { message: "Truck ID is required" },
                { status: 400 }
            );
        }

        const updatedTruck = await truck_details.findByIdAndUpdate(
            id,
            {
                modal: model,  // Map frontend's 'model' to schema's 'modal'
                make,
                year
            },
            { new: true }
        );

        if (!updatedTruck) {
            return NextResponse.json(
                { message: "Truck not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Truck updated successfully", truck: updatedTruck },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error updating truck", error: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Remove a truck
export async function DELETE(request) {
    try {
        await connectToDb();
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { message: "Truck ID is required" },
                { status: 400 }
            );
        }

        const deletedTruck = await truck_details.findByIdAndDelete(id);

        if (!deletedTruck) {
            return NextResponse.json(
                { message: "Truck not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Truck deleted successfully", truck: deletedTruck },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error deleting truck", error: error.message },
            { status: 500 }
        );
    }
}