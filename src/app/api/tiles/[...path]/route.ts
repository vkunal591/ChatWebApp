import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const targetUrl = `http://localhost:8080/${params.path.join('/')}`;
    const res = await fetch(targetUrl);

    const buffer = await res.arrayBuffer();
    const response = new NextResponse(buffer, {
        status: res.status,
        headers: res.headers,
    });

    // Add CORS header
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
}
