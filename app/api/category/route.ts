import { authOptions } from '@/lib/auth';
import { prisma } from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Session not found', {
      status: 401,
    });
  }

  try {
    const data = await prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: [{ rank: 'asc' }],
      include: {
        group: true,
      },
    });

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch categories', { status: 500 });
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
    const data = await prisma.category.create({
      data: {
        ...reqData,
        userId: session.user.id,
      },
      include: {
        group: true
      }
    });

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to create category', { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Session not found', {
      status: 401,
    });
  }

  const reqData = await req.json();
  const resData: any[] = [];

  try {
    for (let i = 0; i < reqData.length; i++) {
      const data = await prisma.category.update({
        where: {
          id: reqData[i].id,
        },
        data: reqData[i],
        include: {
          group: true
        }
      });
      resData.push(data);
    }
    return new Response(JSON.stringify(resData), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to put categoris', { status: 500 });
  }
}
