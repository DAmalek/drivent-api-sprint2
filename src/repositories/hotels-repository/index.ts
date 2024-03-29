import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findFirstHotel(hotelId: number) {
  return prisma.hotel.findFirst({
    where: { id: hotelId },
    include: { Rooms: true },
  });
}

export default { findHotels, findFirstHotel };
