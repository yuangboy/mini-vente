

function getDynamicPrice(
  productType: "high-end-phone" | "mid-range-phone" | "laptop",
  clientType: "particular" | "professional",
  annualRevenue?: number
): number {
  const prices = {
    particular: {
      "high-end-phone": 1500,
      "mid-range-phone": 800,
      laptop: 1200,
    },
    professionalLow: {
      "high-end-phone": 1150,
      "mid-range-phone": 600,
      laptop: 1000,
    },
    professionalHigh: {
      "high-end-phone": 1000,
      "mid-range-phone": 550,
      laptop: 900,
    },
  };

  if (clientType === "particular") return prices.particular[productType];
  if ((annualRevenue ?? 0) > 10_000_000)
    return prices.professionalHigh[productType];
  return prices.professionalLow[productType];
}

