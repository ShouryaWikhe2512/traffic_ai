import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const TARGET_URL = "https://unspeakingly-overdogmatical-annita.ngrok-free.dev/data";

    try {
        console.log("[PROXY] GETting Mobility Data from:", TARGET_URL);

        const response = await fetch(TARGET_URL, {
            method: "GET",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[PROXY] Backend Error:", response.status, errorText);
            return NextResponse.json(
                { error: `Backend returned ${response.status}`, details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[PROXY] Connection Failed:", error);
        return NextResponse.json(
            { error: "Internal Proxy Error", details: error.message },
            { status: 502 }
        );
    }
}

// Support POST just in case, but redirect to GET logic
export async function POST() {
    return GET();
}
