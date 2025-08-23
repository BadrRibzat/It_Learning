// server/scripts/seedData.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { data } from "../data/flashcards";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    if (!db) throw new Error("❌ Failed to get database connection");

    const collection = db.collection("flashcards");
    const existing = await collection.findOne({ type: "payload" });

    if (existing) {
      console.log("💡 Data already seeded.");
      const force = process.argv.includes("--force");
      if (!force) {
        console.log("👉 Use --force to overwrite");
        await mongoose.disconnect();
        return;
      }

      console.log("🔥 --force detected: dropping existing collection...");
      await db.dropCollection("flashcards");
      console.log("🗑️ Collection dropped");
    }

    await collection.insertOne({
      ...data,
      type: "payload",
      createdAt: new Date().toISOString(),
    });

    console.log("🎉 Flashcard data seeded successfully!");
    console.log(
      `📦 ${data.stacks.length} stacks, ${data.stacks.reduce(
        (sum: number, s: any) => sum + s.totalCardCount,
        0
      )} flashcards`
    );
    console.log(
      `🌍 Languages: ${data.ui_translations.languages_supported.join(", ")}`
    );

    await mongoose.disconnect();
    console.log("👋 Database connection closed.");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Unexpected error:", err.message);
    } else {
      console.error("❌ Unexpected non-Error:", err);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  seed().catch(console.error);
}

export default seed;

