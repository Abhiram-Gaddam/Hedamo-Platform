 export const submitProduct = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 60;
      resolve({
        productName: data.productName,
        score,
        explanation: score >= 80 
          ? "Excellent transparency. All required information provided."
          : score >= 70
          ? "Good transparency. Minor improvements suggested."
          : "Moderate transparency. Several areas need attention.",
        suggestions: [
          "Add detailed sourcing for key ingredients.",
          "Include certification IDs.",
          "Clarify packaging recyclability."
        ],
        flags: score < 70 ? ["Incomplete sourcing"] : [],
      });
    }, 2000);
  });
};