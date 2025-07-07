import "dotenv/config";

/**
 * Changes the subscription plan for an account in Outseta
 * @param {string} accountUid - The unique identifier for the account
 * @param {string} newPlanUid - The unique identifier for the new plan to change to
 * @param {boolean} startImmediately - Whether the changes should start immediately (defaults to false)
 * @returns {Promise<Object>} - The API response
 */
export async function changePlan(
  accountUid,
  newPlanUid,
  startImmediately = false
) {
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
      `/api/v1/crm/accounts/${accountUid}: [${accountResponse.status}] ${
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
    Plan: {
      Uid: newPlanUid,
    },
    BillingRenewalTerm: currentSubscription.BillingRenewalTerm,
    Account: {
      Uid: accountUid,
    },
  };

  const subscriptionResponse = await fetch(
    `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/billing/subscriptions/${currentSubscription.Uid}/changeSubscription?startImmediately=${startImmediately}`,
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
  const endpoint = `/api/v1/billing/subscriptions/${currentSubscription.Uid}/changeSubscription`;
  console.debug(`\n--- ${endpoint} response ---`);
  console.debug(JSON.stringify(subscriptionData, null, 2));
  console.debug("------------------------------\n");

  if (!subscriptionResponse.ok) {
    throw new Error(
      `${endpoint}: [${subscriptionResponse.status}] ${
        subscriptionData.ErrorMessage || subscriptionData.Message || ""
      }`
    );
  }

  return subscriptionData;
}

/**
 * Previews the subscription plan change without making any actual changes
 * @param {string} accountUid - The unique identifier for the account
 * @param {string} newPlanUid - The unique identifier for the new plan to preview
 * @param {boolean} startImmediately - Whether the changes should start immediately (defaults to true)
 * @returns {Promise<Object>} - The preview response
 */
export async function previewPlanChange(
  accountUid,
  newPlanUid,
  startImmediately = false
) {
  console.debug(`previewPlanChange startImmediately: ${startImmediately}`);

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
      `/api/v1/crm/accounts/${accountUid}: [${accountResponse.status}] ${
        accountData.ErrorMessage || accountData.Message || ""
      }`
    );
  }

  console.debug(`✅ Account data fetched for preview: ${accountUid}`);

  // Step 2: Validate that the account has a current subscription
  if (!accountData.CurrentSubscription) {
    throw new Error(
      `Account ${accountUid} does not have an active subscription`
    );
  }

  const currentSubscription = accountData.CurrentSubscription;

  // Step 3: Preview the subscription change
  const previewPayload = {
    Plan: {
      Uid: newPlanUid,
    },
    // Use the same billing renewal term as the current subscription
    BillingRenewalTerm: currentSubscription.BillingRenewalTerm,
    Account: {
      Uid: accountUid,
    },
  };

  const previewResponse = await fetch(
    `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/billing/subscriptions/${currentSubscription.Uid}/changesubscriptionpreview?startImmediately=${startImmediately}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(previewPayload),
    }
  );

  const previewData = await previewResponse.json();
  const endpoint = `/api/v1/billing/subscriptions/${currentSubscription.Uid}/changesubscriptionpreview`;
  console.debug(`\n--- ${endpoint} response ---`);
  console.debug(JSON.stringify(previewData, null, 2));
  console.debug("------------------------------\n");

  if (!previewResponse.ok) {
    throw new Error(
      `${endpoint}: [${previewResponse.status}] ${
        previewData.ErrorMessage || previewData.Message || ""
      }`
    );
  }

  return previewData;
}
