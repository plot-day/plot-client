import { prisma } from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const id = params.id;

  try {
    const plot = await prisma.plot.findUnique({
      where: {
        id,
      },
    });

    return NextResponse.json({ plot });
  } catch (error) {
    console.error(error);
    return new Response('Failed to get plot', { status: 500 });
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

    const res = await prisma.plot.update({
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
    return new Response('Failed to update plot: ' + id, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const res = await prisma.plot.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to delete plot:' + id, { status: 500 });
  }
}
