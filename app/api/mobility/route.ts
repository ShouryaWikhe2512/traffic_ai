import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const TARGET_URL = "https://unspeakingly-overdogmatical-annita.ngrok-free.dev/data";

    try {
        const body = await request.json().catch(() => ({}));

        console.log("[PROXY] Forwarding POST to Mobility Cloud...");

        const response = await fetch(TARGET_URL, {
            method: "POST",
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`[PROXY] Backend Error: ${response.status}`);
            return NextResponse.json(
                { error: `Mobility Cloud returned ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[PROXY] Tunnel Failure:", error);
        return NextResponse.json(
            { error: "Protocol Error in Mobility Tunnel", details: error.message },
            { status: 502 }
        );
    }
}

// Fallback for debugging
export async function GET() {
    return NextResponse.json({ status: "ready", method: "POST_REQUIRED", endpoint: "/api/mobility" });
}
