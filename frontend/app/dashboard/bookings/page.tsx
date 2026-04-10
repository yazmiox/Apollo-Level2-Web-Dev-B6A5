import { getAllBookings, getMyBookings, getVendorBookings } from "@/app/actions/booking";
import { getSession } from "@/app/lib/auth-server";
import AdminBookings from "../_components/AdminBookings";
import UserBookings from "../_components/UserBookings";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = session.user;
  const params = await searchParams;
  const q = params.q || "";
  const status = params.status || "";

  // Admin see all system bookings
  if (user?.role === 'admin') {
    const bookings = await getAllBookings({ q, status });
    return <AdminBookings initialBookings={bookings.data || []} role="admin" />;
  }

  // Vendors see bookings specifically for their equipment
  if (user?.role === 'vendor') {
    const bookings = await getVendorBookings({ q, status });
    return <AdminBookings initialBookings={bookings.data || []} role="vendor" />;
  }

  // Normal users only see their personal rental history (bookings they made)
  const bookings = await getMyBookings({ q, status });
  return <UserBookings initialBookings={bookings.data || []} />;
}
