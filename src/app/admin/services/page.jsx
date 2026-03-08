import { db } from "@/app/db/db";
import { services } from "@/app/db/schema";
import ManageService from "../_components/forms/manage-service";

export default async function ServicesPage() {
  const data = await db.select().from(services);

  return (
    <div className="space-y-6">
      <h1
        className="text-3xl font-heading"
        style={{ color: "var(--color-primary)" }}
      >
        Manage Services
      </h1>

      <ManageService services={data} />
    </div>
  );
}
