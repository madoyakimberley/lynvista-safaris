import { db } from "./db.js";
import { tours } from "./schema.js";

async function seed() {
  console.log("⏳ Starting TiDB seed...");

  const tourData = [
    {
      title: "Safari Packages",
      slug: "safari-packages",
      description: "Explore Kenya's top safari destinations.",
      base_price: "500.00",
      duration: "3 Days",
      location: "Kenya",
      image: "dest1.WebP",
    },
    {
      title: "Cultural & Community Tours",
      slug: "cultural-community-tours",
      description: "Immerse in local culture.",
      base_price: "250.00",
      duration: "2 Days",
      location: "Kenya",
      image: "dest2.WebP",
    },
    {
      title: "Group Tours & Excursions",
      slug: "group-tours-excursions",
      description: "Perfect for friends and families.",
      base_price: "350.00",
      duration: "2-4 Days",
      location: "Kenya",
      image: "dest3.WebP",
    },
    {
      title: "Domestic Tours & Weekend Getaways",
      slug: "domestic-weekend-getaways",
      description: "Quick escapes around Kenya.",
      base_price: "150.00",
      duration: "1-3 Days",
      location: "Kenya",
      image: "dest4.WebP",
    },
    {
      title: "International Holiday Packages",
      slug: "international-holiday-packages",
      description: "Curated international packages.",
      base_price: "1200.00",
      duration: "5-10 Days",
      location: "Various",
      image: "dest5.WebP",
    },
    {
      title: "Student Travel & Educational Tours",
      slug: "student-educational-tours",
      description: "Guided learning experiences.",
      base_price: "100.00",
      duration: "2-7 Days",
      location: "Kenya",
      image: "dest6.WebP",
    },
  ];

  try {
    for (const tour of tourData) {
      await db
        .insert(tours)
        .values(tour)
        .onDuplicateKeyUpdate({
          set: {
            title: tour.title,
            description: tour.description,
            base_price: tour.base_price,
            duration: tour.duration,
            location: tour.location,
            image: tour.image,
          },
        });
      console.log(`✅ Seeded: ${tour.title}`);
    }
    console.log("🚀 TiDB is now fully populated!");
  } catch (error) {
    console.error("❌ Error seeding TiDB:", error);
  } finally {
    process.exit(); // Ensures the process closes correctly
  }
}

seed();
