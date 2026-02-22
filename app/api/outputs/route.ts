import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Priority for local backend, fallback to ngrok if needed (but primarily local for user's current session)
    const TARGET_URL = "http://localhost:8000/outputs";

    try {
        console.log("[PROXY] GETting Decision History from:", TARGET_URL);

        const response = await fetch(TARGET_URL, {
            method: "GET",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[PROXY] History Backend Error:", response.status, errorText);
            return NextResponse.json(
                { error: `Backend returned ${response.status}`, details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[PROXY] History Connection Failed:", error);
        return NextResponse.json(
            { error: "Internal Proxy Error", details: error.message },
            { status: 502 }
        );
    }
}
