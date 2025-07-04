import "dotenv/config";

/**
 * Creates a new plan in Outseta
 * @param {Object} planDetails - The plan details (name, price, planFamilyUid, etc.)
 * @returns {Promise<Object>} - The API response
 */
async function createPlan({
  name,
  monthlyRate,
  planFamilyUid,
  trialPeriodDays,
  isActive,
}) {
  const payload = {
    AccountRegistrationMode: 1,
    IsActive: isActive,
    Name: name,
    PlanFamily: { Uid: planFamilyUid },
    MonthlyRate: monthlyRate,
    TrialPeriodDays: trialPeriodDays,
  };

  const response = await fetch(
    `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/billing/plans`,
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

  console.debug("--- api/v1/billing/plans response ---");
  console.debug(JSON.stringify(data, null, 2));
  console.debug("------------------------------");

  if (!response.ok) {
    throw new Error(
      `/api/v1/billing/plans: [${response.status}] ${
        data.ErrorMessage || data.Message || response.statusText
      }`
    );
  }
  return data;
}

export { createPlan };
