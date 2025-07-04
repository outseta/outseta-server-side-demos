import "dotenv/config";
import { input } from "@inquirer/prompts";
import { updateUsageBasedPricing } from "./track-usage.js";

// CLI execution
async function main() {
  try {
    let accountUid;
    while (true) {
      accountUid = await input({
        message: "Enter the Account UID:",
      });
      if (accountUid.trim() !== "") break;
      console.log("Account UID is required");
    }

    let addOnUid;
    while (true) {
      addOnUid = await input({
        message: "Enter the Add-on UID:",
      });
      if (addOnUid.trim() !== "") break;
      console.log("Add-on UID is required");
    }

    let amount;
    while (true) {
      const amountInput = await input({
        message: "Enter the usage amount:",
      });
      const value = parseInt(amountInput, 10);
      if (isNaN(value) || value <= 0) {
        console.log("Amount must be a positive number");
        continue;
      }
      amount = value;
      break;
    }

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
