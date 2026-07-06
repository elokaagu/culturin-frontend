/** Minimal RFC4180-ish CSV parser: handles quoted fields, embedded commas/newlines, and "" escapes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim().length > 0));
}

const HEADER_ALIASES: Record<string, string[]> = {
  email: ["email", "emailaddress", "e-mail"],
  firstName: ["firstname", "fname", "first"],
  lastName: ["lastname", "lname", "last", "surname"],
  company: ["company", "companyname", "organization", "organisation"],
};

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

export type ParsedSubscriberRow = {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  /** Every column from the source file for this row, keyed by its original header — so Studio can show the full record, not just the mapped fields. */
  raw: Record<string, string>;
};

/** Parses a CSV file's text into subscriber rows, matching common Mailchimp-style header names. */
export function parseSubscriberCsv(text: string): { rows: ParsedSubscriberRow[]; unmappedColumns: string[] } {
  const table = parseCsv(text);
  if (table.length === 0) return { rows: [], unmappedColumns: [] };

  const [headerRow, ...dataRows] = table;
  const normalizedHeaders = headerRow.map(normalizeHeader);

  const columnIndex: Partial<Record<keyof typeof HEADER_ALIASES, number>> = {};
  const mappedIdx = new Set<number>();

  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    const idx = normalizedHeaders.findIndex((h) => aliases.includes(h));
    if (idx !== -1) {
      columnIndex[field as keyof typeof HEADER_ALIASES] = idx;
      mappedIdx.add(idx);
    }
  }

  const unmappedColumns = headerRow.filter((_, i) => !mappedIdx.has(i));

  const rows: ParsedSubscriberRow[] = dataRows.map((cells) => {
    const raw: Record<string, string> = {};
    headerRow.forEach((header, i) => {
      const label = header.trim();
      if (label) raw[label] = (cells[i] ?? "").trim();
    });

    return {
      email: (columnIndex.email !== undefined ? cells[columnIndex.email] : "")?.trim() ?? "",
      firstName: (columnIndex.firstName !== undefined ? cells[columnIndex.firstName] : "")?.trim() ?? "",
      lastName: (columnIndex.lastName !== undefined ? cells[columnIndex.lastName] : "")?.trim() ?? "",
      company: (columnIndex.company !== undefined ? cells[columnIndex.company] : "")?.trim() ?? "",
      raw,
    };
  });

  return { rows, unmappedColumns };
}
