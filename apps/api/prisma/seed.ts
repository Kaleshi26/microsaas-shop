// apps/api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({
      data: [
        { name: 'Pro Hoodie', description: 'Cozy dev hoodie', priceCents: 5900, imageUrl: 'https://picsum.photos/seed/hoodie/600/400' },
        { name: 'Coffee Mug', description: 'Ceramic mug', priceCents: 1900, imageUrl: 'https://picsum.photos/seed/mug/600/400' },
        { name: 'Sticker Pack', description: '10x die-cut', priceCents: 900, imageUrl: 'https://picsum.photos/seed/sticker/600/400' }
      ]
    });
    console.log('Seeded products');
  } else {
    console.log('Products already seeded');
  }
}

main().finally(() => prisma.$disconnect());