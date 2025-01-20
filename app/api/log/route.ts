import { authOptions } from '@/lib/auth';
import { prisma } from '@/prisma/client';
import dayjs from 'dayjs';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Session not found', {
      status: 401,
    });
  }

  const searchParams = req.nextUrl.searchParams;
  
  const dateParam = searchParams.get('date');
  const date = dateParam ? (isNaN((new Date(dateParam)).getTime()) ? null : dayjs(dateParam)) : undefined;
  const dateStart = date ? new Date(date.startOf('day').toISOString()) : undefined;
  const dateEnd = date ? new Date(date.endOf('day').toISOString()) : undefined;

  const categoryId = searchParams.get('categoryId') || undefined;

  try {
    const data = await prisma.log.findMany({
      where: {
        userId: session.user.id,
        date: date && { gte: dateStart, lte: dateEnd },
        categoryId,
      },
      include: { category: true },
      orderBy: [{ createdAt: 'asc' }],
    });

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch logs', { status: 500 });
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
    const data = await prisma.log.create({
      data: {
        ...reqData,
        userId: session.user.id,
      },
      include: { category: true },
    });

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to create log', { status: 500 });
  }
}
