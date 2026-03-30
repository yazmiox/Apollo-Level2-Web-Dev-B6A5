import { getAllBookings, getMyBookings } from "@/app/actions/booking";
import { getSession } from "@/app/lib/auth-server";
import AdminBookings from "../_components/AdminBookings";
import UserBookings from "../_components/UserBookings";

export default async function BookingsPage() {
  const session = await getSession();
  const user = session?.user;

  // Admin sees all system bookings
  if (user.role === 'admin') {
    const bookings = await getAllBookings();
    return <AdminBookings initialBookings={bookings.data || []} />;
  }

  // Normal users only see their personal rental history
  const bookings = await getMyBookings();
  return <UserBookings initialBookings={bookings.data || []} />;
}
