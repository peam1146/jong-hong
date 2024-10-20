import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed data for the `Place` model
  const place1 = await prisma.place.create({
    data: {
      name: 'ENG Library @EN3',
      open: '08:00 AM',
      close: '04:00 PM',
    },
  });

  const place3 = await prisma.place.create({
    data: {
      name: 'Sky Cafe @EN4 11th Floor',
      open: '08:00 AM',
      close: '04:00 PM',
    },
  });

  const place2 = await prisma.place.create({
    data: {
      name: 'EN100 3rd Floor',
      open: '08:00 AM',
      close: '04:00 PM',
    },
  });

  // Seed data for the `Room` model with associated placeId
  await prisma.room.createMany({
    data: [
      {
        name: '210',
        minCapacity: 1,
        maxCapacity: 10,
        available: true,
        placeId: place1.id, // Associate with Place A
      },
      {
        name: '211',
        minCapacity: 1,
        maxCapacity: 10,
        available: true,
        placeId: place1.id, // Associate with Place A
      },
      {
        name: '212',
        minCapacity: 1,
        maxCapacity: 10,
        available: true,
        placeId: place1.id, // Associate with Place A
      },
      {
        name: '213',
        minCapacity: 1,
        maxCapacity: 10,
        available: true,
        placeId: place1.id,
      },
      {
        name: '214',
        minCapacity: 1,
        maxCapacity: 10,
        available: true,
        placeId: place1.id,
      },
      {
        name: '301',
        minCapacity: 1,
        maxCapacity: 10,
        available: true,
        placeId: place2.id,
      },
      {
        name: '302',
        minCapacity: 1,
        maxCapacity: 10,
        available: true,
        placeId: place2.id,
      },
      {
        name: '303',
        minCapacity: 1,
        maxCapacity: 10,
        available: true,
        placeId: place2.id,
      },
      {
        name: '304',
        minCapacity: 1,
        maxCapacity: 10,
        available: true,
        placeId: place2.id,
      },
      {
        name: '305',
        minCapacity: 1,
        maxCapacity: 10,
        available: true,
        placeId: place2.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
