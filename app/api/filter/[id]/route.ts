import { prisma } from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = params.id;

  try {
    const filter = await prisma.filter.findUnique({
      where: {
        id,
      },
    });

    return NextResponse.json({ filter });
  } catch (error) {
    console.error(error);
    return new Response('Failed to get filter', { status: 500 });
  }
};

export async function PATCH(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const res = await prisma.filter.update({
      where: {
        id: id,
      },
      data,
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to update filter:' + id, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const res = await prisma.filter.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to delete filter:' + id, { status: 500 });
  }
}
