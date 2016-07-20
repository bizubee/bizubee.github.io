/* Example definition of a simple mode that understands a subset of
 * JavaScript:
 */
{
  const keywords = [
    'var',
    'then',
    'import',
    'as',
    'new',
    'delete',
    'const',
    'return',
    'if',
    'for',
    'while',
    'catch',
    'in',
    'on'
  ];

  const indentKeywords = [
    'try',
    'finally',
    'do',
    'else',
  ];

  CodeMirror.defineSimpleMode("bizubee", {
    // The start state contains the rules that are intially used
    start: [
      {regex: /(from)([\t ]+)(.*)$/, token: ['keyword', null, 'string']},

      // The regex matches the token, the token property contains the type
      {regex: /"(?:[^\\]|\\.)*?"/, token: "string"},
      // You can match multiple tokens at once. Note that the captured
      // groups must span the whole string in this case
      {regex: /(function)(\s+)([a-z$][\w$]*)/,
       token: ["keyword", null, "variable-2"]},
      // Rules are matched in the order in which they appear, so there is
      // no ambiguity between this one and the one above
      {regex: new RegExp(`(?:${keywords.join('|')})\\b`),
       token: "keyword"},
      {regex: new RegExp(`(?:${indentKeywords.join('|')})\\b`),
       token: "keyword", indent: true},
      {regex: /true|false|null|undefined/, token: "atom"},
      {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
       token: "number"},
      {regex: /\/\/.*/, token: "comment"},
      {regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3"},
      // A next property will cause the mode to move to a different state
      {regex: /\/\*/, token: "comment", next: "comment"},
      {regex: /[-+\/*=<>!]+/, token: "operator"},
      // indent and dedent properties guide autoindentation
      {regex: /[\{\[\(]/, indent: true},
      {regex: /[\}\]\)]/, dedent: true},
      {regex: /[a-z$][\w$]*/, token: "variable"},
    ],
    // The multi-line comment state.
    comment: [
      {regex: /.*?\*\//, token: "comment", next: "start"},
      {regex: /.*/, token: "comment"}
    ],
    // The meta property contains global information about the mode. It
    // can contain properties like lineComment, which are supported by
    // all modes, and also directives like dontIndentStates, which are
    // specific to simple modes.
    meta: {
      electricChars: "{}[]",
      dontIndentStates: ["comment"],
      lineComment: "//",
    }
  });

}
