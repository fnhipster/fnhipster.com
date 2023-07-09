// deno-lint-ignore-file no-explicit-any no-prototype-builtins

export function flattenObject(data: any): any {
  const result: any = {};

  function flatten(obj: any, prefix = '') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null) {
          flatten(value, newKey);
        } else {
          result[newKey] = value;
        }
      }
    }
  }

  flatten(data);
  return result;
}
