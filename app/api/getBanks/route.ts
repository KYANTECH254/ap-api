import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET(req: NextRequest) {
  const filePath = path.join(process.cwd(), 'data', 'info.json');

  try {
    let data = [];

    if (fs.existsSync(filePath)) {
      const json = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(json || '[]');
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: 'Banks fetched!',
        banks: data,
      }),
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Failed to read bank data',
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}

// Optional: handle preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}
