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

getExamples().forEach(([sqlFileName, sql]) => {
  test(sqlFileName, (t) => {
    if (sqlFileName === "parse_error.sql") {
      t.throws(() => parse(sql));
      return;
    }
    parse(sql);
    t.pass();
  });
});
