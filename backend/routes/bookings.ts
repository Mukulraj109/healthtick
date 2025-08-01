import { Router } from 'express';
import { getBookingsForDate, createBooking, deleteBooking } from '../controllers/bookingController';

const router = Router();

router.get('/:date', getBookingsForDate);
router.post('/', createBooking);
router.delete('/:id', deleteBooking);

export default router;