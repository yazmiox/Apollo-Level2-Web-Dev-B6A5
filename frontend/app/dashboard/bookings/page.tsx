import { getAllBookings, getMyBookings } from "@/app/actions/booking";
import { getSession } from "@/app/lib/auth-server";
import AdminBookings from "../_components/AdminBookings";
import UserBookings from "../_components/UserBookings";

export const dynamic = "force-dynamic";

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const session = await getSession();
  const user = session?.user;
  const params = await searchParams;
  const q = params.q || "";
  const status = params.status || "";

  // Admin sees all system bookings
  if (user?.role === 'admin') {
    const bookings = await getAllBookings({ q, status });
    return <AdminBookings initialBookings={bookings.data || []} />;
  }

  // Normal users only see their personal rental history
  const bookings = await getMyBookings({ q, status });
  return <UserBookings initialBookings={bookings.data || []} />;
}
