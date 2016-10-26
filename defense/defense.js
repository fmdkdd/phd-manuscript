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

// {a: b, c: d} -> 'a="b" c="d"'
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
var b       = content_tag.bind(null, 'b')
var figure  = content_tag.bind(null, 'figure')

var img = childless_tag.bind(null, 'img')

// Semantic tags
var note = (c) => div(c, {role: 'note'})
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
var content = (c) => div(c, {class: 'content'})

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


    slide([
      h1("Les buts du programmeur"),

      p(b('Correction:')),
      p('Élaborer un programme conforme à la spécification'),

    ]),

    sec('Le problème'),


    slide([
      h1('Étendre des interpréteurs pour sécuriser le nuage'),

      p(`Projet ${b('SecCloud')} du labex CominLabs (2012-2016)`),

      content([
        img({src: 'img/chrome-logo.svg',
             style: 'width: 100px'}),
        p('Sécuriser les applications web exécutées dans les navigateurs',
          {style: `display: inline-block;
                   width: 440px;
                   margin: 80px 20px;
                   position: relative;
                   top: -20px;`}),

        img({src: 'img/js.png',
             style: 'width: 100px'}),
        p('en analysant les programmes JavaScript',
          {style: `display: inline-block;
                   width: 440px;
                   margin: 20px;
                   position: relative;
                   top: -30px;`})
      ])
    ]),


    slide([
      h1('Analyser les programmes JavaScript'),

      p("Analyse de flot d'information (Austin et Flanagan 2012)"),

      p(img({src: 'img/fenton-example.svg',
             style: 'margin: 40px 0'})),
    ]),

    slide([
      h1("Modifier l'interpréteur"),

      p("Implémenter des analyses en modifiant l'interpréteur:"),

      p(img({src: 'img/problem1b.svg',
             style: 'margin: 20px 0'}))
    ]),

    slide(overlay([
      figure(img({src: 'img/narcissus-diff-raw.png'})),
      figure(img({src: 'img/narcissus-diff-annotated.png'}))
    ])),

    slide(figure(img({src: 'img/narcissus-diff.svg'}))),

    slide([
      h1("Modifier l'interpréteur: les objectifs"),

      p("Prototyper rapidement les analyses"),
      p("Minimiser les changements de code"),
      p("Séparer le code des analyses pour pouvoir les auditer"),
    ]),

    slide([
      h1("Détourner l'interpréteur"),

      p(`Changer le comportement de l'interpréteur en minimisant
les changements de code`),

      p([
        img({src: 'img/problem1b.svg',
             style: `width: 350px;
                     vertical-align: top`}),
        img({src: 'img/problem2.svg',
             style: 'width: 350px'})
      ])
    ]),


    sec("Construire un interpréteur par modules"),

    slide([
      h1(`Utiliser ${code('with')}`),

      p(img({src: 'img/foal-5.svg'})),

    ]),


    sec("Étendre Narcissus par manipulation de portée"),


    sec("Conclusions"),

  ])
)
