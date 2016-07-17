var Metalsmith  = require("metalsmith");
var markdown    = require("metalsmith-markdown");
var templates   = require("metalsmith-templates");
var collections = require("metalsmith-collections");
var permalinks  = require("metalsmith-permalinks");
var drafts      = require("metalsmith-drafts");
var define      = require("metalsmith-define");
var sass        = require('metalsmith-sass');
var assets      = require('metalsmith-assets');
var prism       = require('metalsmith-prism');

require('./bizubee-highlighter');

require('marked').setOptions({
  langPrefix: 'language-',
});

Metalsmith(__dirname)
  .source("src")
  .metadata({
    logo: '/images/logo.png',
    nav: [
      {
        title: 'Guide',
        url: 'docs.html'
      },
      {
        title: 'Tools',
        url: 'try.html'
      },
      {
        title: 'Try',
        url: 'try/'
      }
    ],
    utils: {
      removeIndent(code) {
        const regex = /^\t*/;
        const lines = code.split('\n');
        let newCode = "";
        let indent = Infinity;

        for (let line of lines) {
          const [match] = line.match(regex);
          if (line.trim() === '') {
            continue;
          }

          if (match.length < indent) {
            indent = match.length;
          }
        }

        return lines
          .map(line => line.slice(indent))
          .join('\n');
      }
    }
  })
  .use(markdown())
  .use(templates({
    engine: "jade",
    pretty: true,
    directory: "templates"
  }))
  .use(assets({
    source: './src/assets',
    destination: './assets'
  }))
  .use(sass({
    outputStyle: "expanded",
    outputDir: 'css/'
  }))
  .use(drafts())
  .use(collections({
    pages: {
      pattern: '*.md',

    }    
  }))
  .use(prism({
    decode: true
  }))
  .clean(false)
  .destination("./")
  .build(function(err) {
    if (err)
      console.log(err);
  });