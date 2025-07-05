import "dotenv/config";
import { input, select } from "@inquirer/prompts";
import { verifyJwtToken } from "./jwt-verify.js";

/**
 * Prompts for the JWT token to verify
 * @returns {Promise<string>} - The JWT token
 */
async function promptForToken() {
  const token = await input({
    message: "  JWT Token to verify:",
    required: true,
    validate: (input) => {
      if (!input.trim()) {
        return "JWT token is required";
      }
      // Basic JWT format validation (three parts separated by dots)
      const parts = input.trim().split(".");
      if (parts.length !== 3) {
        return "Invalid JWT format. JWT should have three parts separated by dots.";
      }
      return true;
    },
  });
  return token.trim();
}

/**
 * Prompts for the verification method
 * @returns {Promise<string>} - The selected verification method
 */
async function promptForMethod() {
  const method = await select({
    message: "  Verification method:",
    choices: [
      {
        name: "Both methods (JWK Set + Profile Endpoint)",
        value: "both",
      },
      {
        name: "JWK Set verification only",
        value: "jwks",
      },
      {
        name: "Profile Endpoint verification only",
        value: "profile",
      },
    ],
    default: "both",
  });
  return method;
}

/**
 * Displays the verification results in a user-friendly format
 * @param {Object} results - The verification results
 * @param {string} method - The verification method used
 */
function displayResults(results, method) {
  console.info("\n🎉 JWT Verification Complete!\n");

  if (results.jwksPayload) {
    console.info("📋 User Information (from JWK Set verification):");
    console.info(`   • Person UID: ${results.jwksPayload.sub}`);
    console.info(`   • Email: ${results.jwksPayload.email}`);
    console.info(`   • Name: ${results.jwksPayload.name}`);
    console.info(
      `   • Account UID: ${results.jwksPayload["outseta:accountUid"]}`
    );
    console.info(
      `   • Is Primary: ${results.jwksPayload["outseta:isPrimary"]}`
    );
    console.info(
      `   • Issued At: ${new Date(
        results.jwksPayload.iat * 1000
      ).toLocaleString()}`
    );
    console.info(
      `   • Expires At: ${new Date(
        results.jwksPayload.exp * 1000
      ).toLocaleString()}`
    );
  }

  if (results.profileData) {
    console.info("\n👤 Extended Profile Information (from Profile Endpoint):");
    console.info(`   • Person UID: ${results.profileData.Uid}`);
    console.info(`   • Email: ${results.profileData.Email}`);
    console.info(`   • First Name: ${results.profileData.FirstName}`);
    console.info(`   • Last Name: ${results.profileData.LastName}`);
    if (results.profileData.ProfileImageS3Url) {
      console.info(
        `   • Profile Image: ${results.profileData.ProfileImageS3Url}`
      );
    }
    if (results.profileData.Account) {
      console.info(`   • Account Name: ${results.profileData.Account.Name}`);
      console.info(`   • Account UID: ${results.profileData.Account.Uid}`);
    }
  }

  console.info("\n✅ Token is valid and verified!");
}

// CLI execution
async function main() {
  try {
    console.info("🔐 JWT Token Verification");
    console.info(
      "This demo verifies Outseta JWT access tokens using two methods:\n"
    );
    console.info("1. JWK Set verification - Uses your domain's public key");
    console.info(
      "2. Profile Endpoint verification - Makes an API call to verify the token\n"
    );

    const token = await promptForToken();
    const method = await promptForMethod();

    console.info("\n🚀 Verifying JWT token...\n");

    const results = await verifyJwtToken({ token, method });

    displayResults(results, method);
  } catch (error) {
    // Suppress stack trace if user exited with Ctrl+C
    if (error instanceof Error && error.name === "ExitPromptError") {
      // noop; silence this error
    } else {
      console.error(
        `\n💥 JWT verification failed: ${error.message || error}\n`
      );
      process.exit(1);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
