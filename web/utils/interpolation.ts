export function templateInterpolation(template: string, values: any) {
  return template.replace(/\{([^}]+)\}/g, (_, field: string) => {
    return field.split('.').reduce((obj, key) => (obj || {})[key], values) || '';
  });
}

export function extractTemplatePlaceholders(template: string) {
  const placeholders = template.match(/\{([^}]+)\}/g) || [];

  return placeholders.map(key => key.match(/[\w.]+/)?.[0]).filter(key => key !== undefined);
}
