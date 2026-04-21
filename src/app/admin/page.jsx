import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import StatsOverview from "./_components/stats/stats-overview";
import jwt from "jsonwebtoken";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  // 1. HARD BLOCK: If no token exists at all
  if (!token) {
    redirect("/admin/login");
  }

  try {
    // 2. VALIDATION: Verify the JWT is real and not tampered with
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // 3. INVALID TOKEN: Kick them out
    redirect("/admin/login");
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-[#451a03]">Admin Dashboard</h1>
      <StatsOverview />
    </div>
  );
}
