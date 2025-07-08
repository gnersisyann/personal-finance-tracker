export function templateInterpolation(template: string, values: any) {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, field: string) => {
    return (
      field.split(".").reduce((obj, key) => (obj || {})[key], values) || ""
    );
  });
}

export function extractTemplatePlaceholders(template: string) {
  const placeholders = template.match(/\{\{([^}]+)\}\}/g) || [];

  return placeholders
    .map((placeholder) => {
      const match = placeholder.match(/\{\{([^}]+)\}\}/);
      return match ? match[1].trim() : "";
    })
    .filter((key) => key !== "");
}
