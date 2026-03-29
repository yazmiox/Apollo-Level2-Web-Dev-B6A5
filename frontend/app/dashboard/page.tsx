import { redirect } from "next/navigation";
import { getStats } from "../actions/stats";
import { getSession } from "../lib/auth-server";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const stats = await getStats();
  const user = session.user;

  if (user.role === "admin") {
    return <div>Admin Overview</div>
  }

  return <div>User Overview</div>
}
