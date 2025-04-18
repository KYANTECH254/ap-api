import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
    const res = NextResponse.next();

    // Set CORS headers on the response
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return new NextResponse(null, { status: 200 });
      }
      
    const filePath = path.join(process.cwd(), 'data', 'info.json');

    try {
        let data = [];

        if (fs.existsSync(filePath)) {
            const json = fs.readFileSync(filePath, 'utf8');
            data = JSON.parse(json || '[]');
        }

        return NextResponse.json({
            success: true,
            message: 'Banks fetched!',
            banks: data,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to read bank data',
            error: (error as Error).message,
        }, { status: 500 });
    }
}
