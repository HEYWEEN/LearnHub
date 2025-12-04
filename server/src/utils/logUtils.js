

export function prettyJSON(data, indent = 0) {
  const pad = "  ".repeat(indent);
  if (data === null) return `${pad}null`;
  if (typeof data !== "object") return `${pad}${data}`;

  if (Array.isArray(data)) {
    let out = `${pad}[数组，共 ${data.length} 项]\n`;
    data.forEach((item, i) => {
      out += `${pad}- [${i}] `;
      if (typeof item === "object") {
        out += "\n" + prettyJSON(item, indent + 1) + "\n";
      } else {
        out += `${item}\n`;
      }
    });
    return out;
  }

  let out = `${pad}{对象}\n`;
  for (const key in data) {
    const val = data[key];
    if (typeof val === "object" && val !== null) {
      out += `${pad}${key}:\n${prettyJSON(val, indent + 1)}\n`;
    } else {
      out += `${pad}${key}: ${val}\n`;
    }
  }
  return out;
};