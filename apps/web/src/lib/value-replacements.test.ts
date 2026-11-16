import assert from "node:assert/strict";
import { test } from "node:test";
import {
  applyValueReplacements,
  classifyReplacements,
} from "./value-replacements.ts";

const carYear = [
  { name: "car", value: "'Toyota'" },
  { name: "year", value: "'2005'" },
];

test("replaces assigned inputs and leaves a computed name alone", () => {
  const source = [
    "String car = 'Honda';",
    "String year = '1991';",
    "String fullName = car + year;",
  ].join("\n");
  assert.equal(
    applyValueReplacements(source, carYear),
    [
      "String car = 'Toyota';",
      "String year = '2005';",
      "String fullName = car + year;",
    ].join("\n"),
  );
});

test("a handwritten finished answer keeps the old result", () => {
  const source = [
    "String car = 'Honda';",
    "String year = '1991';",
    "String fullName = 'Honda1991';",
  ].join("\n");
  assert.equal(
    applyValueReplacements(source, carYear),
    [
      "String car = 'Toyota';",
      "String year = '2005';",
      "String fullName = 'Honda1991';",
    ].join("\n"),
  );
});

test("literals that are not assignments stay", () => {
  const source = "String fullName = 'Honda' + '1991';";
  assert.equal(applyValueReplacements(source, carYear), source);
});

test("replaces tight spacing, later assignments, and an if result stays", () => {
  const source = [
    "Integer score=80;",
    "score = 90;",
    "String result;",
    "if (score >= 70) {",
    "    result = 'pass';",
    "} else {",
    "    result = 'fail';",
    "}",
  ].join("\n");
  assert.equal(
    applyValueReplacements(source, [{ name: "score", value: "50" }]),
    [
      "Integer score=50;",
      "score = 50;",
      "String result;",
      "if (score >= 70) {",
      "    result = 'pass';",
      "} else {",
      "    result = 'fail';",
      "}",
    ].join("\n"),
  );
});

test("strings, comments, compound assignments, and other names stay", () => {
  const source = [
    "// car = 'Honda';",
    "String note = 'car = Honda';",
    "String carName = 'Honda';",
    "String car = 'Hon;da';",
    "Integer total = 1;",
    "total += 5;",
    "row.car = 'Honda';",
  ].join("\n");
  assert.equal(
    applyValueReplacements(source, [
      { name: "car", value: "'Toyota'" },
      { name: "total", value: "9" },
    ]),
    [
      "// car = 'Honda';",
      "String note = 'car = Honda';",
      "String carName = 'Honda';",
      "String car = 'Toyota';",
      "Integer total = 9;",
      "total += 5;",
      "row.car = 'Honda';",
    ].join("\n"),
  );
});

test("comma declarations and case-insensitive names", () => {
  const source = "String Car = 'Honda', year = '1991';";
  assert.equal(
    applyValueReplacements(source, carYear),
    "String Car = 'Toyota', year = '2005';",
  );
});

test("generic types and map commas stay outside the replaced value", () => {
  const source = "Map<String, Integer> scores = new Map<String, Integer>{ 'a' => 1 };";
  assert.equal(
    applyValueReplacements(source, [{ name: "scores", value: "new Map<String, Integer>()" }]),
    "Map<String, Integer> scores = new Map<String, Integer>();",
  );
});

test("a later assignment and a for-loop input can change", () => {
  const source = [
    "String car;",
    "car = 'Honda';",
    "Integer total = 0;",
    "for (Integer i = 0; i < 3; i++) {",
    "    total = total + i;",
    "}",
  ].join("\n");
  assert.equal(
    applyValueReplacements(source, [
      { name: "car", value: "'Toyota'" },
      { name: "i", value: "1" },
    ]),
    [
      "String car;",
      "car = 'Toyota';",
      "Integer total = 0;",
      "for (Integer i = 1; i < 3; i++) {",
      "    total = total + i;",
      "}",
    ].join("\n"),
  );
});

test("an empty list and a blank value leave the snippet", () => {
  const source = "String car = 'Honda';";
  assert.equal(applyValueReplacements(source, []), source);
  assert.equal(
    applyValueReplacements(source, [{ name: "car", value: "  ;  " }]),
    source,
  );
});

test("an assignment inside a call or condition keeps the closer", () => {
  assert.equal(
    applyValueReplacements("doSomething(car = 'Honda');", carYear),
    "doSomething(car = 'Toyota');",
  );
  assert.equal(
    applyValueReplacements("if (car = 'Honda') { }", [
      { name: "car", value: "'Toyota'" },
    ]),
    "if (car = 'Toyota') { }",
  );
});

test("a for-loop update keeps the closing parenthesis", () => {
  assert.equal(
    applyValueReplacements("for (Integer i = 0; i < 3; i = i + 1) { }", [
      { name: "i", value: "1" },
    ]),
    "for (Integer i = 1; i < 3; i = 1) { }",
  );
});

test("a comparison before a comma declarator leaves the next name", () => {
  assert.equal(
    applyValueReplacements(
      "String label = score < 70 ? 'low' : 'high', extra = 'x';",
      [{ name: "label", value: "'z'" }],
    ),
    "String label = 'z', extra = 'x';",
  );
  assert.equal(
    applyValueReplacements("Integer a = x > 1 ? 2 : 3, b = 4;", [
      { name: "a", value: "0" },
    ]),
    "Integer a = 0, b = 4;",
  );
});

test("an unclosed call is left unchanged", () => {
  const source = "String car = foo(1, 2";
  assert.equal(
    applyValueReplacements(source, [{ name: "car", value: "'Toyota'" }]),
    source,
  );
});

test("a partial row or a repeated name does not rewrite", () => {
  const source = "String car = 'Honda';";
  assert.equal(
    applyValueReplacements(source, [
      { name: "car", value: "'Toyota'" },
      { name: "year", value: "" },
    ]),
    source,
  );
  assert.equal(
    applyValueReplacements(source, [
      { name: "car", value: "'A'" },
      { name: "Car", value: "'B'" },
    ]),
    source,
  );
  assert.deepEqual(
    classifyReplacements([
      { id: "blank", name: " ", value: " " },
      { id: "car", name: "car", value: " 'Toyota'; " },
    ]),
    {
      accepted: [{ id: "car", name: "car", value: "'Toyota'" }],
      fields: false,
      duplicate: false,
    },
  );
  assert.deepEqual(
    classifyReplacements([
      { name: "car", value: "'A'" },
      { name: "Car", value: "'B'" },
    ]).accepted,
    [],
  );
});
