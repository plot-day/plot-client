import { prisma } from '@/prisma/client';
import { JsonObject, JsonValue } from '@prisma/client/runtime/library';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params: { id, fieldId } }: { params: { id: string; fieldId: string } }
) {
  try {
    const data = await req.json();

    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    const fieldIdx = category?.fields.findIndex(
      (item: any) => item.id === fieldId
    );
    const fields =
      category && category.fields ? [...category.fields] : category?.fields;

    if (
      fieldIdx !== undefined &&
      fieldIdx !== null &&
      fieldIdx > -1 &&
      category &&
      category.fields &&
      category.fields[fieldIdx]
    ) {
      fields?.splice(fieldIdx, 1, {
        ...(category.fields[fieldIdx] as JsonObject),
        ...data,
      });
    }

    const res = await prisma.category.update({
      where: {
        id: id,
      },
      include: {
        group: true,
      },
      data: {
        ...category,
        fields: fields?.filter(
          (v): v is Exclude<JsonValue, null> => v !== null
        ),
      },
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to update category:' + id, { status: 500 });
  }
}
