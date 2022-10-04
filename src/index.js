import SqlBaseParser from '../lib/TrinoParser'
import SqlBaseLexer from '../lib/TrinoLexer'
import antlr4 from 'antlr4'

export function parse(input) {
  const chars = new antlr4.InputStream(input)
  const lexer = new SqlBaseLexer(chars)
  const tokens = new antlr4.CommonTokenStream(lexer)
  const parser = new SqlBaseParser(tokens)
  parser.buildParseTrees = true
  const tree = parser.parse()
  return tree
}
