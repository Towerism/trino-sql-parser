import SqlBaseParser from '../lib/TrinoParser'
import SqlBaseLexer from '../lib/TrinoLexer'
import antlr4 from 'antlr4'

class ErrorListener extends antlr4.error.ErrorListener {
  syntaxError(_recognizer, offendingSymbol, line, column, msg, _err) {
    throw new Error(`${offendingSymbol} line ${line}, col ${column}: ${msg}`)
  }
}

export function parse(input) {
  const chars = new antlr4.InputStream(input)
  const lexer = new SqlBaseLexer(chars)
  const tokens = new antlr4.CommonTokenStream(lexer)
  const parser = new SqlBaseParser(tokens)
  parser.buildParseTrees = true
  parser.removeErrorListeners()
  parser.addErrorListener(new ErrorListener());
  const tree = parser.parse()
  return tree
}
