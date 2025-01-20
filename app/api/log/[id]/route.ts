import { prisma } from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const id = params.id;

  try {
    const log = await prisma.log.findUnique({
      where: {
        id,
      },
    });

    return NextResponse.json({ log });
  } catch (error) {
    console.error(error);
    return new Response('Failed to get log', { status: 500 });
  }
};

export async function PATCH(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const data = await req.json();

    const res = await prisma.log.update({
      where: { id },
      data: {
        ...data,
        date: data.date || data.date === undefined ? data.date : null,
      },
      include: { category: true },
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    const err = error as Error;

    if (err.name === 'AbortError') {
      return new Response('Request timeout: ' + id, { status: 408 });
    }

    console.error('PATCH error:', err);
    return new Response('Failed to update log: ' + id, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const res = await prisma.log.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to delete log:' + id, { status: 500 });
  }
}
