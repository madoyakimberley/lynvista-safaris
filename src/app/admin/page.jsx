import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import StatsOverview from "./_components/stats/stats-overview";
import jwt from "jsonwebtoken";
export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  try {
    // Verify JWT

    jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_dont_use_in_dev",
    );
  } catch (err) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-[#451a03]">Admin Dashboard</h1>
      <StatsOverview />
    </div>
  );
}
