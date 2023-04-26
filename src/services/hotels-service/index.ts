import { notFoundError } from '@/errors';
import { paymentRequiredError } from '@/errors/payment-required-error';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function verifyTicketAndEnrollment(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError;

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError;
  if (ticket.status !== 'PAID') throw paymentRequiredError();
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw paymentRequiredError();
}

async function getHotels(userId: number) {
  try {
    await verifyTicketAndEnrollment(userId);
  } catch (error) {
    if (error.name === 'NotFoundError') throw notFoundError();
    if (error.name === 'PaymentRequiredError') throw paymentRequiredError();
  }

  const hotels = await hotelsRepository.findHotels();
  if (hotels.length === 0) throw notFoundError();

  return hotels;
}

async function getOneHotel(userId: number, hotelId: number) {
  try {
    await verifyTicketAndEnrollment(userId);
  } catch (error) {
    if (error.name === 'NotFoundError') throw notFoundError();
    if (error.name === 'PaymentRequiredError') throw paymentRequiredError();
  }

  const hotel = await hotelsRepository.findFirstHotel(hotelId);
  if (!hotel) throw notFoundError();

  return hotel;
}
export default { getHotels, getOneHotel };
