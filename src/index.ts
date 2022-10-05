import SqlBaseParser from "../lib/TrinoParser";
import SqlBaseLexer from "../lib/TrinoLexer";
import antlr4 from "antlr4";

// eslint-disable-next-line
const BaseErrorListener = (antlr4 as any).error.ErrorListener;

class ErrorListener extends BaseErrorListener {
  syntaxError(_recognizer, offendingSymbol, line, column, msg) {
    throw new Error(`${offendingSymbol} line ${line}, col ${column}: ${msg}`);
  }
}

export function parse(input: string): antlr4.ParserRuleContext {
  const chars = new antlr4.InputStream(input);
  const lexer = new SqlBaseLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new SqlBaseParser(tokens);
  parser.buildParseTrees = true;
  parser.removeErrorListeners();
  // eslint-disable-next-line
  /* @ts-ignore */
  parser.addErrorListener(new ErrorListener());
  const tree = parser.parse();
  return tree;
}
