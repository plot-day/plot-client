import {
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORIES_GROUP,
  DEFAULT_GROUPS,
} from '@/constants/default';
import { prisma } from '@/prisma/client';
import { NextRequest } from 'next/server';
import { LexoRank } from 'lexorank';

export async function POST(req: NextRequest) {
  try {
    const reqData = await req.json();
    const userId = reqData.userId;

    const data = await prisma.user.findMany({
      orderBy: [{ createdAt: 'asc' }],
    });

    let rank = LexoRank.middle();

    for (let i = 0; i < DEFAULT_GROUPS.length; i++) {
      const group = DEFAULT_GROUPS[i];
      const data = await prisma.group.create({
        data: {
          ...group,
          userId,
          rank: rank.toString()
        },
      });

      rank = rank.genNext();

      if (group.title === DEFAULT_CATEGORIES_GROUP) {
        let categoryRank = LexoRank.middle();

        for (let j = 0; j < DEFAULT_CATEGORIES.length; j++) {
          await prisma.category.create({
            data: {
              ...DEFAULT_CATEGORIES[j],
              userId,
              groupId: data.id,
              rank: categoryRank.toString()
            },
          });

          categoryRank = categoryRank.genNext();
        }
      }
      rank = rank.genNext();
    }

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch users', { status: 500 });
  }
}
