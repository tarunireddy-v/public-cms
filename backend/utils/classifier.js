const classifyDepartment = (text = "") => {
  const content = text.toLowerCase();

  if (content.includes("light") || content.includes("electric")) {
    return "Electricity";
  }

  if (content.includes("water") || content.includes("leak")) {
    return "Water";
  }

  if (content.includes("garbage")) {
    return "Sanitation";
  }

  if (content.includes("pothole")) {
    return "Roads";
  }

  return "General";
};

module.exports = { classifyDepartment };
