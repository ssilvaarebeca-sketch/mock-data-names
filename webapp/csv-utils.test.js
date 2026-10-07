const assert = require("node:assert");
const { parseCSV } = require("./csv-utils.js");

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (err) {
    console.error(`FAIL - ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

test("parses simple rows", () => {
  const { headers, records } = parseCSV("id,first_name,last_name\n1,Ada,Lovelace\n2,Alan,Turing\n");
  assert.deepStrictEqual(headers, ["id", "first_name", "last_name"]);
  assert.deepStrictEqual(records, [
    { id: "1", first_name: "Ada", last_name: "Lovelace" },
    { id: "2", first_name: "Alan", last_name: "Turing" },
  ]);
});

test("handles quoted fields with embedded commas", () => {
  const { records } = parseCSV('id,name,note\n1,"Smith, Jane","says ""hi"""\n');
  assert.deepStrictEqual(records, [{ id: "1", name: "Smith, Jane", note: 'says "hi"' }]);
});

test("handles quoted fields with embedded newlines", () => {
  const { records } = parseCSV('id,bio\n1,"line one\nline two"\n');
  assert.deepStrictEqual(records, [{ id: "1", bio: "line one\nline two" }]);
});

test("handles CRLF line endings", () => {
  const { headers, records } = parseCSV("a,b\r\n1,2\r\n3,4\r\n");
  assert.deepStrictEqual(headers, ["a", "b"]);
  assert.deepStrictEqual(records, [
    { a: "1", b: "2" },
    { a: "3", b: "4" },
  ]);
});

test("handles missing trailing values", () => {
  const { records } = parseCSV("a,b,c\n1,2\n");
  assert.deepStrictEqual(records, [{ a: "1", b: "2", c: "" }]);
});

test("returns empty result for empty input", () => {
  const { headers, records } = parseCSV("");
  assert.deepStrictEqual(headers, []);
  assert.deepStrictEqual(records, []);
});
