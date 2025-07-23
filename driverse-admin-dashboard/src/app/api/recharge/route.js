import { connectToDb } from "@/app/lib/db";
import SubscriptionPlan from "@/app/lib/SubscriptionPlan";
import { NextResponse } from "next/server";
import TalkTimePlan from "@/app/lib/TalkTimePlan";

export async function POST(request) {
    try {
        await connectToDb();

        const { userId, planid, state } = await request.json();

        // Validate required fields
        if (!userId || !planid) {
            return NextResponse.json(
                { error: "Missing required fields (userId, planid)" },
                { status: 400 }
            );
        }

        // Find the TalkTimePlan
        const talkTimePlan = await TalkTimePlan.findById(planid);

        if (!talkTimePlan) {
            return NextResponse.json(
                { error: "TalkTimePlan not found" },
                { status: 404 }
            );
        }

        // Extract values from the plan
        const hours = talkTimePlan.hours;
        const price = talkTimePlan.price;
        const minutes = hours * 60; // Convert hours to minutes

        // Calculate cost per hour and cost per minute
        const costPerHour = talkTimePlan.costPerHour;
        const costPerMinute = talkTimePlan.costPerMinute;

        // Create the recharge object
        const newRecharge = {
            hours,
            minutes,
            price,
            costPerHour,
            costPerMinute,
            state: state || "completed", // default to completed if not provided
            rechargeDate: new Date(),
            planid
        };

        // Find the user's subscription plan or create one if it doesn't exist
        let subscriptionPlan = await SubscriptionPlan.findOne({ userId });

        if (!subscriptionPlan) {
            // If no plan exists, create a new one
            subscriptionPlan = new SubscriptionPlan({
                userId,
                minutes,
                recharges: [newRecharge]
            });
        } else {
            // If plan exists, add the recharge and update the total minutes
            subscriptionPlan.recharges.push(newRecharge);
            subscriptionPlan.minutes += minutes;
        }

        await subscriptionPlan.save();

        return NextResponse.json(
            { message: "Recharge added successfully", subscriptionPlan },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error in recharge route:", error);
        return NextResponse.json(
            { error: "Failed to process recharge", details: error.message },
            { status: 500 }
        );
    }
}



export async function GET() {
    try {
        await connectToDb();

        // Find all TalkTimePlans and sort by createdAt in descending order
        const plans = await TalkTimePlan.find({}).sort({ createdAt: -1 });

        return NextResponse.json(plans, { status: 200 });

    } catch (error) {
        console.error("Error fetching TalkTimePlans:", error);
        return NextResponse.json(
            { error: "Failed to fetch plans", details: error.message },
            { status: 500 }
        );
    }
}