import TrinoParser from "../lib/TrinoParser";
import TrinoLexer from "../lib/TrinoLexer";
import antlr4 from "antlr4";
import type { ErrorListener } from "antlr4/error/ErrorListener";
import type { ParserRuleContext } from "antlr4";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const AntlrErrorListener: typeof ErrorListener = (antlr4 as any).error
  .ErrorListener;

class TrinoErrorListener extends AntlrErrorListener {
  syntaxError(_recognizer, offendingSymbol, line, column, msg) {
    throw new Error(`${offendingSymbol} line ${line}, col ${column}: ${msg}`);
  }
}

interface Parser {
  buildParseTrees: boolean;
  removeErrorListeners(): void;
  addErrorListener(listener: ErrorListener): void;
  parse(): ParserRuleContext;
}

interface Options {
  allowMultiStatement: boolean;
}

export function parse(
  input: string,
  options: Options = { allowMultiStatement: true }
) {
  const chars = new antlr4.InputStream(input);
  const lexer = new TrinoLexer(chars);
  const tokenStream = new antlr4.CommonTokenStream(lexer);

  tokenStream.fill();

  if (!options.allowMultiStatement) {
    const numSemicolons = tokenStream.tokens.filter(
      (t) => t.type === TrinoLexer.SEMICOLON_
    ).length;
    if (numSemicolons > 1) {
      throw new Error(
        "Query with multiple statements is not supported at this time."
      );
    }
  }

  const parser = new TrinoParser(tokenStream) as Parser;
  parser.buildParseTrees = true;
  parser.removeErrorListeners();
  parser.addErrorListener(new TrinoErrorListener());
  const tree = parser.parse();

  return tree;
}
