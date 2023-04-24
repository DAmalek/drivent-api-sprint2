import { Router } from 'express';
import { listHotels, listOneHotel } from '@/controllers/hotels-controller';
import { authenticateToken } from '@/middlewares';

const hotelRouter = Router();

hotelRouter.all('/*', authenticateToken).get('/', listHotels).get('/:hotelId', listOneHotel);

export { hotelRouter };
