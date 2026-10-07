// Minimal RFC4180-ish CSV parser: handles quoted fields, embedded commas/newlines, and "" escapes.
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\r") {
      // ignore, \n (if present) ends the row
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const nonEmpty = rows.filter((r) => !(r.length === 1 && r[0] === ""));
  if (nonEmpty.length === 0) {
    return { headers: [], records: [] };
  }

  const headers = nonEmpty[0];
  const records = nonEmpty.slice(1).map((r) => {
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = r[idx] ?? "";
    });
    return record;
  });

  return { headers, records };
}

if (typeof module !== "undefined") {
  module.exports = { parseCSV };
}
