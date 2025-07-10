export function importFolder(
  modules: Record<string, any>
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const path in modules) {
    const fileName =
      path
        .split("/")
        .pop()
        ?.replace(/\.[^/.]+$/, "") || "";

    const module = modules[path];

    if (module.default) {
      result[fileName] = module.default;
    } else {
      result[fileName] = module;
    }
  }

  return result;
}
