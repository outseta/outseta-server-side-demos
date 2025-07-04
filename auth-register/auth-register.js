import "dotenv/config";

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

export { registerUser, getPlans };
