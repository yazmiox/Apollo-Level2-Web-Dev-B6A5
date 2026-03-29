import { getSession } from "../lib/auth-server";
import AdminOverview from "./_components/AdminOverview";
import { getStats } from "../actions/stats";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const stats = await getStats();
  const user = session.user;

  if (user.role === "admin") {
    return <AdminOverview stats={stats} />;
  }

  return <div>User Overview</div>
}
