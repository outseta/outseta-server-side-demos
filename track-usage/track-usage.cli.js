import "dotenv/config";
import inquirer from "inquirer";
import { updateUsageBasedPricing } from "./track-usage.js";

// CLI execution
async function main() {
  const questions = [
    {
      type: "input",
      name: "accountUid",
      message: "Enter the Account UID:",
      validate: (input) => input.trim() !== "" || "Account UID is required",
    },
    {
      type: "input",
      name: "addOnUid",
      message: "Enter the Add-on UID:",
      validate: (input) => input.trim() !== "" || "Add-on UID is required",
    },
    {
      type: "input",
      name: "amount",
      message: "Enter the usage amount:",
      validate: (input) => {
        const value = parseInt(input, 10);
        if (isNaN(value) || value <= 0) {
          return "Amount must be a positive number";
        }
        return true;
      },
      filter: (input) => parseInt(input, 10),
    },
  ];

  try {
    const { accountUid, addOnUid, amount } = await inquirer.prompt(questions);

    console.log("\n🚀 Track usage...\n");

    const result = await updateUsageBasedPricing(accountUid, addOnUid, amount);
    console.log("\n🎉 Success! Usage record created");
    console.log("");
    console.log(`   Usage UID: ${result.Uid}`);
    console.log(`   Usage Date: ${result.UsageDate}`);
    console.log(`   Amount: ${result.Amount}`);
    console.log(`   Created: ${result.Created}`);
    console.log(`   Updated: ${result.Updated}`);
    console.log("");
  } catch (error) {
    // Suppress stack trace if user exited with Ctrl+C
    if (error && error.message && error.message.includes("SIGINT")) {
      console.log("Exited.");
      process.exit(0);
    }
    console.error(`\n💥 Failed to track usage: ${error.message || error}\n`);
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
