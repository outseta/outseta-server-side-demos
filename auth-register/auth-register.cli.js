import "dotenv/config";
import { input, select } from "@inquirer/prompts";
import { registerUser, getPlans } from "./auth-register.js";

// CLI execution
async function main() {
  try {
    // Fetch and select plan
    console.log("\n📦 Fetching available plans...");
    const plans = await getPlans();
    if (!Array.isArray(plans) || plans.length === 0) {
      throw new Error("No plans found.");
    }
    const planChoices = plans.map((plan) => ({
      name: `${plan.Name} (UID: ${plan.Uid}) - ${
        plan.Description ? plan.Description.replace(/<[^>]+>/g, "") : ""
      }`,
      value: plan.Uid,
    }));
    const selectedPlanUid = await select({
      message: "Select a plan:",
      choices: planChoices,
    });
    const selectedPlan = plans.find((p) => p.Uid === selectedPlanUid);
    console.log(
      `\n✅ Selected plan: ${selectedPlan.Name} (UID: ${selectedPlan.Uid})\n`
    );

    // Person and account details
    console.log("👤 Enter Person details:");
    const email = await input({
      message: "  Email:",
      default: `jane+${Date.now()}@example.com`,
    });
    const firstName = await input({
      message: "  First Name:",
      default: "Jane",
    });
    const lastName = await input({
      message: "  Last Name:",
      default: "Doe",
    });
    const coffeePreference = await input({
      message: "  Coffee Preference:",
      default: "Latte",
    });

    console.log("\n🏢 Enter Account details:");
    const companyName = await input({
      message: "  Company Name:",
      default: "Acme Inc",
    });
    const companyMaskot = await input({
      message: "  Company Maskot:",
      default: "Roadrunner",
    });

    console.log("\n🚀 Registering user...\n");
    const { PrimaryContact, Name, Maskot } = await registerUser({
      planUid: selectedPlanUid,
      email,
      firstName,
      lastName,
      coffeePreference,
      companyName,
      companyMaskot,
    });

    console.log(
      "📮 A confirmation email has been sent to the user. They must follow the link in the email to set their password and activate their account before logging in."
    );
    console.log("");
    console.log(`   Email: ${PrimaryContact?.Email}`);
    console.log(`   First Name: ${PrimaryContact?.FirstName}`);
    console.log(`   Last Name: ${PrimaryContact?.LastName}`);
    console.log(`   Coffee Preference: ${PrimaryContact?.CoffeePreference}`);
    console.log(`   Company Name: ${Name}`);
    console.log(`   Company Maskot: ${Maskot}`);
    console.log("");

    console.log(
      "\nℹ️ You may generate a token on their behalf in a server side environment (even before they have set their password), see auth-token.js\n"
    );
  } catch (error) {
    // Suppress stack trace if user exited with Ctrl+C
    if (error && error.message && error.message.includes("SIGINT")) {
      console.log("Exited.");
      process.exit(0);
    }
    console.error(`💥 Failed to register user: ${error.message || error}\n`);
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  console.log("\nExited.");
  process.exit(0);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
