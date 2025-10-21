import { drizzle } from "drizzle-orm/mysql2";
import { subscriptionPlans } from "../drizzle/schema";

async function seedSubscriptionPlans() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);

  const plans = [
    {
      id: "plan_basic",
      name: "Basic Plan",
      price: "5.00",
      currency: "GBP",
      billingPeriod: "monthly" as const,
      features: JSON.stringify([
        "Personalized workout plans",
        "Selected video classes (20-30 per category)",
        "Basic guided meditations (10-15 per theme)",
        "Basic nutrition plans",
        "Basic menstrual cycle tracking",
        "Monthly reports",
        "Ad-free experience"
      ]),
    },
    {
      id: "plan_premium",
      name: "Premium Plan",
      price: "12.00",
      currency: "GBP",
      billingPeriod: "monthly" as const,
      features: JSON.stringify([
        "Advanced personalized workout plans",
        "Complete video class library (hundreds of videos)",
        "Full meditation and mental wellness library",
        "Personalized nutrition plans",
        "Advanced menstrual cycle and menopause tracking",
        "Advanced conversational AI",
        "Detailed weekly and monthly reports",
        "Exclusive content (webinars, expert interviews)",
        "Wearable device integration",
        "Priority support",
        "Premium community access"
      ]),
    },
  ];

  try {
    for (const plan of plans) {
      await db.insert(subscriptionPlans).values(plan).onDuplicateKeyUpdate({
        set: {
          name: plan.name,
          price: plan.price,
          features: plan.features,
        },
      });
    }
    console.log("✓ Subscription plans seeded successfully");
  } catch (error) {
    console.error("Failed to seed subscription plans:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedSubscriptionPlans();

