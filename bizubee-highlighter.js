

var Prism = require('prismjs');

// Ignore comments starting with { to privilege string interpolation highlighting
var comment = /#(?!\{).+/,
    interpolation = {
      pattern: /$\{[^}]+\}/,
      alias: 'variable'
    };

Prism.languages.bizubee = Prism.languages.extend('javascript', {
  'comment': comment,
  'symbol': /\b(this)\b/,
  'boolean': /\b(true|false)\b/,
  'constant': /\b(undefined|null|Infinity)\b/,
  'string': [

    // Strings are multiline
    {
      pattern: /'(?:\\?[^\\])*?'/,
      greedy: true,
    },

    {
      // Strings are multiline
      pattern: /"(?:\\?[^\\])*?"/,
      greedy: true,
      inside: {
        'interpolation': interpolation
      }
    }
  ],
  'keyword': /\b(var|const|import|from|as|and|break|catch|class|continue|delete|do|else|extends|finally|for|if|in|is|isnt|new|not|on|or|return|super|switch|then|throw|try|while|await|yield)\b/,
  'class-member': {
    pattern: /@(?!\d)\w+/,
    alias: 'variable'
  }
});

Prism.languages.insertBefore('bizubee', 'comment', {
  'multiline-comment': {
    pattern: /###[\s\S]+?###/,
    alias: 'comment'
  },

  // Block regexp can contain comments and interpolation
  'block-regex': {
    pattern: /\/{3}[\s\S]*?\/{3}/,
    alias: 'regex',
    inside: {
      'comment': comment,
      'interpolation': interpolation
    }
  }
});


Prism.languages.insertBefore('bizubee', 'keyword', {
  // Object property
  'property': /(?!\d)\w+(?=\s*:(?!:))/
});


delete Prism.languages.bizubee['template-string'];

Prism.languages.bzb = Prism.languages.bizubee;


