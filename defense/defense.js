// Markdown to HTML through Pandoc sucks so bad.  Let me just friggin' escape to
// HTML at least if you are always trying to insert <p> where I don't want them!
// Jeez.  Looks like I have to do it myself.

function content_tag(tag, children, attrs) {
  var content = Array.isArray(children) ? children.join('\n') : children
  return `<${tag}${attr_string(attrs)}>${content}</${tag}>`
}

function childless_tag(tag, attrs) {
  return `<${tag}${attr_string(attrs)}/>`
}

// {a: b, c: d} -> a="b" c="d"
function attr_string(attrs) {
  return Object.keys(attrs || [])
    .map(key => ` ${key}="${attrs[key]}"`)
    .join('')
}

// Raw HTML tags
var body    = content_tag.bind(null, 'body')
var head    = content_tag.bind(null, 'head')
var h1      = content_tag.bind(null, 'h1')
var h2      = content_tag.bind(null, 'h2')
var div     = content_tag.bind(null, 'div')
var p       = content_tag.bind(null, 'p')
var section = content_tag.bind(null, 'section')
var footer  = content_tag.bind(null, 'footer')
var ul      = content_tag.bind(null, 'ul')
var li      = content_tag.bind(null, 'li')
var span    = content_tag.bind(null, 'span')
var pre     = content_tag.bind(null, 'pre')
var code    = content_tag.bind(null, 'code')

var img = childless_tag.bind(null, 'img')

// Semantic tags
var note  = (c) => div(c, {role: 'note'})
var sec = (text) => section(h1(text), {class: 'titleslide slide level1'})
var slide = (c) => section(c, {class: 'slide level2'})
var title = (text, author, date) =>
    section([
      h1(text, {class: 'title'}),
      footer([
        span(author, {class: 'author'}),
        span(date, {class: 'date'})
      ])
    ], {class: 'title'})
var overlay = (c) => div(c, {class: 'incremental overlay'})

// And here's the actual content
console.log(
  body([

    title(`Étendre des interpréteurs par détournement
<br><br>ou<br><br>
Comment étendre des interpréteurs sans en modifier le code`,
          'fmdkdd',
          'Mines Nantes, 18 novembre 2016'),

    sec('Préliminaires'),

    slide([
      h1("Le cycle de vie d'un programme"),

      overlay([
        img({src: "img/problem4.svg",
             class: 'center',
             style: 'width: 550px'}),
        img({src: "img/problem4b.svg",
             class: 'center',
             style: 'width: 550px'})
      ])
    ]),
  ])
)
