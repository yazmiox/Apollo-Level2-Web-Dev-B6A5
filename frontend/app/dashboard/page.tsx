import { getSession } from "../lib/auth-server";
import AdminOverview from "./_components/AdminOverview";
import UserOverview from "./_components/UserOverview";
import { getStats } from "../actions/stats";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const statsRes = await getStats();
  const stats = statsRes.data!;
  const user = session.user;

  if (user.role === "admin") {
    return <AdminOverview stats={stats} />;
  }

  return <UserOverview stats={stats} username={user.name!} />;
}
