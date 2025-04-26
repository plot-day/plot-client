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
  
  try {
    const data = await prisma.log.findMany({
      where: {
        userId: session.user.id,
      },
      include: { plot: true },
      orderBy: [{ createdAt: 'asc' }],
    });

    return new Response(JSON.stringify(data), { status: 200 });
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
      include: { plot: true },
    });

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to create log', { status: 500 });
  }
}
