import test from "ava";

import fs from "fs";
import { URL } from "url";

import { parse } from "./dist/main.mjs";

function getExamples() {
  const examplesPath = new URL("./examples", import.meta.url).pathname;
  return fs.readdirSync(examplesPath).map((exampleFile) => {
    const exampleFilePath = new URL(
      `./examples/${exampleFile}`,
      import.meta.url
    ).pathname;
    const buffer = fs.readFileSync(exampleFilePath);
    return [exampleFile, buffer.toString()];
  });
}

const examples = getExamples()
const examplesMap = Object.fromEntries(examples)

examples.forEach(([sqlFileName, sql]) => {
  test(sqlFileName, (t) => {
    if (sqlFileName.endsWith("_error.sql")) {
      t.throws(() => parse(sql));
      return;
    }
    parse(sql);
    t.pass();
  });
});

test("option: allowMultiStatement false - successful parse", (t) => {
  parse(examplesMap["single_statement.sql"], { allowMultiStatement: false });
  t.pass();
});

test("option: allowMultiStatement false - failed parse", (t) => {
  t.throws(() => parse(examplesMap["multi_statement.sql"], { allowMultiStatement: false }));
});
