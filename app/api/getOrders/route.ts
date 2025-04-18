import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const res = NextResponse.next();

  // Set CORS headers on the response
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   const filePath = path.join(process.cwd(), 'data', 'web-info.json');

  try {
    const orders = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]')
      : [];

    if (orders.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No Orders fetched!',
        orders,
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Orders fetched!',
      orders,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to read orders',
      error: (error as Error).message,
    }, { status: 500 });
  }
}
