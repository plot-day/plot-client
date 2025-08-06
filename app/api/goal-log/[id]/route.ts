import { authOptions } from '@/lib/auth';
import { prisma } from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = params.id;

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response('Session not found', {
        status: 401,
      });
    }

    // Update
    const goalLog = await prisma.goalLog.findUnique({
      where: {
        id,
      },
      include: { goal: true },
    });

    return NextResponse.json({ goalLog });
  } catch (error) {
    console.error(error);
    return new Response('Failed to get goalLog', { status: 500 });
  }
};

export async function PATCH(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response('Session not found', {
        status: 401,
      });
    }

    const reqData = await req.json();

    // Check if exists and delete
    const prevDataList = await prisma.goalLog.findMany({
      where: {
        userId: session.user.id,
        date: reqData.date,
        goalId: reqData.goalId,
      },
      orderBy: [{ createdAt: 'asc' }],
    });

    const deleteIds = [];
    if (prevDataList.length > 1) {
      const deleteDataList = prevDataList.filter((data) => data.id !== id);
      for (const deleteData of deleteDataList) {
        deleteIds.push(deleteData.id);
        await prisma.goalLog.delete({
          where: {
            id: deleteData.id,
          },
        });
      }
    }

    // Update
    const res = await prisma.goalLog.update({
      where: { id },
      data: reqData,
      include: { goal: true },
    });

    return NextResponse.json(
      { updated: res, deleted: deleteIds },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;

    if (err.name === 'AbortError') {
      return new Response('Request timeout: ' + id, { status: 408 });
    }

    console.error('PATCH error:', err);
    return new Response('Failed to update goalLog: ' + id, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const res = await prisma.goalLog.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to delete goalLog:' + id, { status: 500 });
  }
}
