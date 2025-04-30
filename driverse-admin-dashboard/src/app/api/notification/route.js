import { NextResponse } from 'next/server'

const NOTIFICATION_SERVICE_URL = 'https://drivers-server-7i39.onrender.com/api/notify/send-notification'

export async function POST(request) {
    try {
        const body = await request.json()
        const { userId, title, body: notificationBody } = body

        // Validate required fields
        if (!userId || !title || !notificationBody) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'UserId, title, and body are required fields'
                },
                { status: 400 }
            )
        }

        // Forward request to notification service
        let response
        try {
            response = await fetch(NOTIFICATION_SERVICE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any additional headers your service requires
                    // 'Authorization': `Bearer ${process.env.API_KEY}`,
                },
                body: JSON.stringify({
                    userId,
                    title,
                    body: notificationBody
                })
            })
        } catch (fetchError) {
            console.error('Notification Service Connection Error:', fetchError)
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to connect to notification service',
                    error: fetchError.message
                },
                { status: 500 }
            )
        }

        // Parse response
        let data
        try {
            data = await response.json()
        } catch (parseError) {
            console.error('Response Parse Error:', parseError)
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to parse notification service response',
                    error: parseError.message
                },
                { status: 500 }
            )
        }

        // Handle service response
        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Notification service request failed',
                    error: data
                },
                { status: response.status }
            )
        }

        // Handle successful response
        return NextResponse.json(
            {
                success: true,
                message: 'Notification sent successfully',
                data
            },
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (error) {
        console.error('Proxy API Error:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Unexpected error occurred while processing notification',
                error: error.message
            },
            { status: 500 }
        )
    }
}

export async function GET() {
    return NextResponse.json(
        {
            success: true,
            message: 'Notification proxy endpoint is available',
            supportedMethods: ['POST']
        },
        { status: 200 }
    )
}