import "dotenv/config";

/**
 * Registers a new user (person + account) in Outseta
 * @param {Object} user - The user details (planUid, email, firstName, lastName, coffeePreference, accountName, accountMascot)
 * @returns {Promise<Object>} - The API response
 */
export async function registerUser({
  planUid,
  email,
  firstName,
  lastName,
  coffeePreference,
  accountName,
  accountMascot,
}) {
  const payload = {
    Name: accountName,
    Mascot: accountMascot,
    Subscriptions: [
      {
        BillingRenewalTerm: 2,
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

  console.debug("--- api/v1/crm/registrations response ---");
  console.debug(JSON.stringify(data, null, 2));
  console.debug("------------------------------");

  if (!response.ok) {
    // Print validation errors if present
    if (
      data.EntityValidationErrors &&
      Array.isArray(data.EntityValidationErrors)
    ) {
      console.debug("\n🔎 Validation errors:");
      data.EntityValidationErrors.forEach((entityError) => {
        const type = entityError.TypeName || "Entity";
        if (
          entityError.ValidationErrors &&
          Array.isArray(entityError.ValidationErrors)
        ) {
          entityError.ValidationErrors.forEach((validationError) => {
            console.debug(
              `  [${type}] ${validationError.PropertyName}: ${validationError.ErrorMessage}`
            );
          });
        }
      });
      console.debug("");
    }

    throw new Error(
      `/api/v1/crm/registrations: [${response.status}] ${
        data.ErrorMessage || data.Message || ""
      }`
    );
  }

  return data;
}
