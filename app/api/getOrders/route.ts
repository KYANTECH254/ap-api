import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma/client';

const prisma = new PrismaClient();

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET(req: NextRequest) {
  try {
    // Fetch all orders from the Prisma model
    const orders = await prisma.order.findMany();

    if (orders.length === 0) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'No Orders fetched!',
          orders,
        }),
        {
          status: 404,
          headers: CORS_HEADERS,
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: 'Orders fetched!',
        orders: orders,
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
        message: 'Failed to fetch orders',
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}

// Optional: Handle preflight requests (OPTIONS method)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}
