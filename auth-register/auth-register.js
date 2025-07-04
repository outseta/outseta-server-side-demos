import "dotenv/config";
import inquirer from "inquirer";

/**
 * Registers a new user (person + account) in Outseta
 * @param {Object} user - The user details (email, firstName, lastName, companyName, companyMaskot, coffeePreference)
 * @returns {Promise<Object>} - The API response
 */
async function registerUser({
  planUid,
  email,
  firstName,
  lastName,
  companyName,
  companyMaskot,
  coffeePreference,
}) {
  try {
    const payload = {
      Name: companyName,
      Maskot: companyMaskot,
      Subscriptions: [
        {
          BillingRenewalTerm: "2", // Now as string
          Plan: {
            Uid: planUid,
          },
        },
      ],
      PersonAccount: [
        {
          IsPrimary: true,
          Person: {
            Email: email,
            FirstName: firstName,
            LastName: lastName,
            CoffeePreference: coffeePreference,
          },
        },
      ],
    };

    const response = await fetch(
      `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/crm/registrations`,
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

    console.info("--- api/v1/crm/registrations response ---");
    console.info(JSON.stringify(data, null, 2));
    console.info("------------------------------");

    if (!response.ok) {
      // Print validation errors if present
      if (
        data.EntityValidationErrors &&
        Array.isArray(data.EntityValidationErrors)
      ) {
        console.info("\n🔎 Validation errors:");
        data.EntityValidationErrors.forEach((entityError) => {
          const type = entityError.TypeName || "Entity";
          if (
            entityError.ValidationErrors &&
            Array.isArray(entityError.ValidationErrors)
          ) {
            entityError.ValidationErrors.forEach((validationError) => {
              console.info(
                `  [${type}] ${validationError.PropertyName}: ${validationError.ErrorMessage}`
              );
            });
          }
        });
        console.info("");
      }

      throw new Error(
        `Failed to register user: ${response.status} - ${
          data.ErrorMessage || data.Message
        }`
      );
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches available plans from Outseta
 * @returns {Promise<Array>} - Array of plan objects
 */
async function getPlans() {
  const response = await fetch(
    `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/billing/plans`,
    {
      method: "GET",
      headers: {
        Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch plans: ${response.status}`);
  }
  const data = await response.json();
  return data.items;
}

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

// Graceful SIGINT (Ctrl+C) handling
process.on("SIGINT", () => {
  console.log("\nExited.");
  process.exit(0);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
