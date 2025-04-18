import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
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
