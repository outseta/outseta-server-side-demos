import "dotenv/config";
import inquirer from "inquirer";

/**
 * Logs in a user and retrieves a JWT access token
 * @param {{ email: string }} params - Object containing the user's email
 * @returns {Promise<Object>} - The API response (token, etc)
 */
async function loginUser({ email }) {
  try {
    const payload = {
      username: email,
    };

    const response = await fetch(
      `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/tokens`,
      {
        method: "POST",
        headers: {
          Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    console.info("--- api/v1/tokens response ---");
    console.info(JSON.stringify(data, null, 2));
    console.info("------------------------------");

    if (!response.ok) {
      throw new Error(
        `Failed to login: ${response.status} - ${
          data.ErrorMessage || data.Message
        }`
      );
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Graceful SIGINT (Ctrl+C) handling
process.on("SIGINT", () => {
  console.log("\nExited.");
  process.exit(0);
});

// CLI execution
async function main() {
  try {
    console.log("🔑 Login");
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "email",
        message: "  Email:",
      },
    ]);

    console.log("\n🚀 Generating token for user...\n");
    const { access_token, expires_in, token_type } = await loginUser(answers);
    console.log(`\n🎉 Success! Token generated.\n`);
    console.log(`   Token type: ${token_type}`);
    console.log(`   JWT: ${access_token.substring(0, 40)}...`);
    console.log(`   Expires in: ${expires_in} seconds\n`);
  } catch (error) {
    // Suppress stack trace if user exited with Ctrl+C
    if (error && error.message && error.message.includes("SIGINT")) {
      console.log("Exited.");
      process.exit(0);
    }
    console.error(`\n💥 Failed to generate token: ${error.message || error}\n`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
