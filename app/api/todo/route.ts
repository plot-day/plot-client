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

  const searchParams = req.nextUrl.searchParams;

  const dateParam = searchParams.get('date');
  const date = dateParam
    ? isNaN(new Date(dateParam).getTime())
      ? null
      : dateParam
    : undefined;
  const categoryId = searchParams.get('categoryId') || undefined;
  const status = searchParams.get('status') || undefined;
  const before = searchParams.get('before') || undefined;
  const filterStr = searchParams.get('filter') || undefined;
  const filterJson = filterStr ? JSON.parse(filterStr) : {};
  const condition = Object.keys(filterJson)[0];
  const fieldValues: { field: string; value: string; operator: '==' | '!=' }[] =
    [];
  const filterExceptFieldValues = filterJson?.[condition]
    ?.map(({ fieldValues: itemFieldValues, ...item }: any) => {
      if (itemFieldValues) {
        fieldValues.push(itemFieldValues);
      }
      return {
        ...item,
      };
    })
    .filter((item: any) => item && Object.keys(item).length > 0);

  try {
    const data = await prisma.todo.findMany({
      where: filterExceptFieldValues
        ? {
            userId: session.user.id,
            [condition]: filterExceptFieldValues,
          }
        : {
            userId: session.user.id,
            date: before
              ? {
                  lt: before,
                }
              : date,
            categoryId,
            status,
          },
      include: { category: true },
      orderBy: [{ createdAt: 'asc' }],
    });

    if (fieldValues.length > 0 && condition === 'AND') {
      const filtered = data.filter((item) => {
        if (
          !item.fieldValues ||
          typeof item.fieldValues !== 'object' ||
          Array.isArray(item.fieldValues)
        ) {
          return false;
        }
        return fieldValues.every(({ field, value, operator }) => {
          if (!field) return false;
          if (
            !item.fieldValues ||
            typeof item.fieldValues !== 'object' ||
            Array.isArray(item.fieldValues)
          ) {
            return false;
          }
          const fieldValuesObj = item.fieldValues as Record<string, unknown>;
          const itemValue = fieldValuesObj[field];
          if (operator === '==') {
            return itemValue === value;
          } else if (operator === '!=') {
            return itemValue !== value;
          }
          return false;
        });
      });

      return new Response(JSON.stringify(filtered), { status: 200 });
    } else {
      return new Response(JSON.stringify(data), { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch todos', { status: 500 });
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
    const data = await prisma.todo.create({
      data: {
        ...reqData,
        userId: session.user.id,
      },
      include: { category: true },
    });

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to create todo', { status: 500 });
  }
}
