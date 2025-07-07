import "dotenv/config";

/**
 * Changes the subscription plan for an account in Outseta
 * @param {string} accountUid - The unique identifier for the account
 * @param {string} newPlanUid - The unique identifier for the new plan to change to
 * @returns {Promise<Object>} - The API response
 */
export async function changePlan(accountUid, newPlanUid) {
  // Step 1: Fetch the account with current subscription info
  const accountResponse = await fetch(
    `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/crm/accounts/${accountUid}?fields=Uid,Name,CurrentSubscription.*`,
    {
      method: "GET",
      headers: {
        Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
        "Content-Type": "application/json",
      },
    }
  );

  const accountData = await accountResponse.json();
  if (!accountResponse.ok) {
    throw new Error(
      `/api/v1/crm/accounts/: [${accountResponse.status}] ${
        accountData.ErrorMessage || accountData.Message || ""
      }`
    );
  }

  console.debug(`✅ Account data fetched for: ${accountUid}`);

  // Step 2: Validate that the account has a current subscription
  if (!accountData.CurrentSubscription) {
    throw new Error(
      `Account ${accountUid} does not have an active subscription`
    );
  }

  const currentSubscription = accountData.CurrentSubscription;
  console.debug(`✅ Found current subscription: ${currentSubscription.Uid}`);

  // Step 3: Update the subscription with the new plan
  const subscriptionUpdatePayload = {
    Uid: currentSubscription.Uid,
    Plan: {
      Uid: newPlanUid,
    },
  };

  const subscriptionResponse = await fetch(
    `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/billing/subscriptions/${currentSubscription.Uid}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriptionUpdatePayload),
    }
  );

  const subscriptionData = await subscriptionResponse.json();
  console.debug("\n--- api/v1/billing/subscriptions response ---");
  console.debug(JSON.stringify(subscriptionData, null, 2));
  console.debug("------------------------------\n");

  if (!subscriptionResponse.ok) {
    throw new Error(
      `/api/v1/billing/subscriptions: [${subscriptionResponse.status}] ${
        subscriptionData.ErrorMessage || subscriptionData.Message || ""
      }`
    );
  }

  return subscriptionData;
}
