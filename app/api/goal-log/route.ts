import { authOptions } from '@/lib/auth';
import { prisma } from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response('Session not found', {
        status: 401,
      });
    }
    const searchParams = req.nextUrl.searchParams;

    const dateParam = searchParams.get('date');
    const date = dateParam
      ? isNaN(new Date(dateParam).getTime())
        ? null
        : dateParam
      : undefined;

    if (!date) {
      return new Response(
        'Fail to get goal logs: Date parameter is required and must be a valid date',
        {
          status: 400,
        }
      );
    }

    const data = await prisma.goalLog.findMany({
      where: {
        userId: session.user.id,
        date,
      },
      include: { goal: true },
      orderBy: [{ createdAt: 'asc' }],
    });

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch goalLogs', { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Session not found', {
      status: 401,
    });
  }

  const reqData = await req.json();
  try {
    // Check if exists and delete
    const prevDataList = await prisma.goalLog.findMany({
      where: {
        userId: session.user.id,
        date: reqData.date,
        goalId: reqData.goalId,
      },
      include: { goal: true },
      orderBy: [{ createdAt: 'asc' }],
    });

    if (prevDataList.length > 1) {
      for (const deleteData of prevDataList) {
        await prisma.goalLog.delete({
          where: {
            id: deleteData.id,
          },
        });
      }
    }

    // Create data
    const data = await prisma.goalLog.create({
      data: {
        ...reqData,
        userId: session.user.id,
      },
      include: { goal: true },
    });

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to create goalLog', { status: 500 });
  }
}
