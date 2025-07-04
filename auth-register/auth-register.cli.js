import "dotenv/config";
import inquirer from "inquirer";
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
      name: `${plan.Name} (UID: ${plan.Uid}) - ${plan.Description ? plan.Description.replace(/<[^>]+>/g, "") : ""}`,
      value: plan.Uid,
    }));
    const { selectedPlanUid } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedPlanUid",
        message: "Select a plan:",
        choices: planChoices,
      },
    ]);
    const selectedPlan = plans.find((p) => p.Uid === selectedPlanUid);
    console.log(
      `\n✅ Selected plan: ${selectedPlan.Name} (UID: ${selectedPlan.Uid})\n`
    );

    const personQuestions = [
      {
        type: "input",
        name: "email",
        message: "  Email:",
        default: `jane+${Date.now()}@example.com`,
      },
      {
        type: "input",
        name: "firstName",
        message: "  First Name:",
        default: "Jane",
      },
      {
        type: "input",
        name: "lastName",
        message: "  Last Name:",
        default: "Doe",
      },
      {
        type: "input",
        name: "coffeePreference",
        message: "  Coffee Preference:",
        default: "Latte",
      },
    ];
    const accountQuestions = [
      {
        type: "input",
        name: "companyName",
        message: "  Company Name:",
        default: "Acme Inc",
      },
      {
        type: "input",
        name: "companyMaskot",
        message: "  Company Maskot:",
        default: "Roadrunner",
      },
    ];

    // Person and account details
    console.log("👤 Enter Person details:");
    const personAnswers = await inquirer.prompt(personQuestions);
    console.log("\n🏢 Enter Account details:");
    const accountAnswers = await inquirer.prompt(accountQuestions);

    console.log("\n🚀 Registering user...\n");
    const { PrimaryContact, Name, Maskot } = await registerUser({
      planUid: selectedPlanUid,
      ...personAnswers,
      ...accountAnswers,
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
