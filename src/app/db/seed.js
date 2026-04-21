import { db } from "./db.js"; // Ensure the extension .js is there
import { tours } from "./schema.js";

async function seed() {
  console.log("⏳ Starting TiDB seed...");

  const tourData = [
    {
      title: "Safari Packages",
      slug: "safari-packages",
      description:
        "Explore Kenya's top safari destinations: Maasai Mara, Amboseli, Tsavo, and Samburu.",
      base_price: "500.00",
      duration: "3 Days",
      location: "Kenya",
    },
    {
      title: "Cultural & Community Tours",
      slug: "cultural-community-tours",
      description: "Immerse in local culture and communities across Kenya.",
      base_price: "250.00",
      duration: "2 Days",
      location: "Kenya",
    },
    {
      title: "Group Tours & Excursions",
      slug: "group-tours-excursions",
      description: "Perfect for friends, families, or corporate groups.",
      base_price: "350.00",
      duration: "2-4 Days",
      location: "Kenya",
    },
    {
      title: "Domestic Tours & Weekend Getaways",
      slug: "domestic-weekend-getaways",
      description: "Quick escapes and domestic trips around Kenya.",
      base_price: "150.00",
      duration: "1-3 Days",
      location: "Kenya",
    },
    {
      title: "International Holiday Packages",
      slug: "international-holiday-packages",
      description: "Travel beyond Kenya with curated international packages.",
      base_price: "1200.00",
      duration: "5-10 Days",
      location: "Various",
    },
    {
      title: "Student Travel & Educational Tours",
      slug: "student-educational-tours",
      description:
        "Educational trips and guided learning experiences for students.",
      base_price: "100.00",
      duration: "2-7 Days",
      location: "Kenya",
    },
  ];

  try {
    for (const tour of tourData) {
      // .onDuplicateKeyUpdate ensures you don't get errors if you run this twice
      await db
        .insert(tours)
        .values(tour)
        .onDuplicateKeyUpdate({
          set: { title: tour.title },
        });
      console.log(`✅ Seeded: ${tour.title}`);
    }
    console.log("🚀 TiDB is now populated with your tours!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding TiDB:", error);
    process.exit(1);
  }
}

seed();
