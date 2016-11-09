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

function html_escape(str) {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
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
var ol      = content_tag.bind(null, 'ol')
var li      = content_tag.bind(null, 'li')
var span    = content_tag.bind(null, 'span')
var pre     = content_tag.bind(null, 'pre')
var code    = content_tag.bind(null, 'code')
var b       = content_tag.bind(null, 'b')
var em      = content_tag.bind(null, 'em')
var figure  = content_tag.bind(null, 'figure')
var script  = content_tag.bind(null, 'script')
var table   = content_tag.bind(null, 'table')
var tr      = content_tag.bind(null, 'tr')
var td      = content_tag.bind(null, 'td')

// I don't put any children in these, but they still need to be closed
var video   = content_tag.bind(null, 'video', null)
var canvas  = content_tag.bind(null, 'canvas', null)

var img = childless_tag.bind(null, 'img')

// Semantic tags
var note = (c) => div(c, {role: 'note'})
var sec = (text) => section(h1(text), {class: 'titleslide slide level1'})
var numsec = (num, text, img) => section([h1(`<span>Partie ${num}</span><hr>${text}`), img], {class: 'num titleslide slide level1'})
var slide = (c) => section(c, {class: 'slide level2'})
var title = (text, author, date, team, supervisor, director) =>
    section([
      h1(text, {class: 'title'}),

      div([
        span(author, {class: 'author'}),
        span(supervisor, {class: 'supervisor'}),
        span(director, {class: 'director'}),
      ], {class: 'authors'}),

      span(team, {class: 'team'}),

      span(date, {class: 'date'}),

      // Here comes corporatism
      img({src: 'img/logo-emn.svg',
           style: `width: 130px;
                   position: absolute;
                   bottom: 0px;
                   left: 50px;`}),

      img({src: 'img/LINA.svg',
           style: `width: 90px;
                   position: absolute;
                   bottom: 20px;
                   left: 240px;`}),

      img({src: 'img/logo-inria.png',
           style: `width: 160px;
                   position: absolute;
                   bottom: 13px;
                   left: 420px;`}),

      img({src: 'img/UBL.png',
           style: `width: 100px;
                   position: absolute;
                   bottom: 20px;
                   right: 50px;`}),
    ], {class: 'title'})
var overlay = (c) => div(c, {class: 'incremental overlay'})
var content = (c) => div(c, {class: 'content'})
var vspace = (px) => div('', {style: `height: ${px}px`})
var tbl = (array) => table(array.map(row => tr(row.map(cell => td(cell)))))

// And here's the actual content
console.log(
  body([

    title(`Étendre des interpréteurs par détournement`,
          'Florent Marchand de Kerchove',
          'Mines Nantes, 18 novembre 2016',
          'ASCOLA',
          'Jacques Noyé', 'Mario Südholt'),

    slide([
      h1("Le plan"),

      p("1. Problématique: étendre des interpréteurs pour &nbsp;&nbsp;&nbsp;&nbsp;sécuriser JavaScript",
        {style: `width: 500px`}),

      img({src: 'img/diff-tangled.svg',
           style: `width: 150px;
                   position: absolute;
                   right: 50px;
                   top: 120px;`}),

      vspace(50),

      p("2. Contribution: construire un interpréteur par<br>&nbsp;&nbsp;&nbsp;&nbsp; modules"),

      img({src: 'img/foal-blocks.svg',
           style: `width: 200px;
                   position: absolute;
                   right: 25px;
                   top: 280px`}),

      vspace(60),

      p("3. Contribution: détourner Narcissus"),

      img({src: 'img/narcissus-diff-after-2c.svg',
           style: `width: 200px;
                   position: absolute;
                   right: 25px;
                   top: 420px;`}),

    ]),

    numsec('1', 'Étendre des interpréteurs pour<br>sécuriser JavaScript',
           img({src: 'img/diff-tangled.svg',
                style: `width: 300px;
                        display: block;
                        margin: 50px auto;`})),

    slide([
      h1('Étendre des interpréteurs pour sécuriser le nuage'),

      p(`Projet ${b('SecCloud')} du labex CominLabs (2012-2016)`),

      content([
        img({src: 'img/chrome-logo.svg',
             style: `width: 100px;`}),
        p('Sécuriser les applications web exécutées dans les navigateurs...',
          {style: `display: inline-block;
                   width: 440px;
                   margin: 50px 20px;
                   position: relative;
                   top: -30px;`}),

        img({src: 'img/js.png',
             style: `width: 100px;`}),
        p('...en analysant les programmes JavaScript',
          {style: `display: inline-block;
                   width: 440px;
                   margin: 20px;
                   position: relative;
                   top: -30px;`}),
      ]),

      p("Analyse statique: analyser le code source"),
      p("<em>Analyse dynamique</em>: analyser l'exécution du programme"),

      note([
        "JS is the only language natively supported by navigators",
        "Makes it popular",
      ]),

    ]),

    slide([
      h1("Analyses dynamiques de programme"),

      p("Analyser le programme pour en déduire le comportement"),

      p(`Ex: analyse de ${em("flot d'information")}:`),

      p(img({src: 'img/facet-1.svg'})),

      p("Flot indirect:"),

      p(img({src: 'img/facet-2.svg'})),

      note(["Indirect flows believed static-only",
            "AF-12 showed it could be done"]),
    ]),

    slide([
      h1("Analyse multi-facettes"),

      p("Analyse dynamique de flot d'information (Austin et Flanagan, 2012)"),

      p(img({src: "img/a-facet.svg"})),

      ul([
        li("Chaque valeur a deux facettes"),
        li("Seule l'autorité voit la facette privée"),
        li([`Le ${b("program counter")} suit les flots indirects`,
            img({src: "img/facet-pc.svg",
                 style: `position: absolute;
                         right: 200px;`})])
      ]),
    ]),

    slide([
      h1('Analyse multi-facettes: exemple'),

      p("Flot indirect (Austin et Flanagan, 2012)"),

      p(img({src: 'img/fenton-example.svg',
             style: 'margin: 40px 0'})),
    ]),


    slide([
      h1("Des interpréteurs JavaScript"),

      p(img({src: "img/interps.svg",
             style: `width: 700px`})),

      p("Autres interpréteurs JavaScript"),

      ul([
        li("Rhino (Java)"),
        li(`${em('Narcissus')} (JavaScript)`)
      ])
    ]),

    slide([
      h1("Narcissus"),

      p(img({src: "img/narcissus.jpg",
             style: `width: 40%;
                     float: left;
                     margin-right: 20px;`})),

      p("Interpréteur JavaScript métacirculaire par Mozilla"),

      p("Idéal pour prototyper des extensions au langage"),

      p(`Utilisé par Austin et Flanagan pour <em>implémenter</em>
         l'analyse multi-facettes`)
    ]),

    slide([h1('Analyse multi-facettes: implémentation'), figure(img({src: 'img/narcissus-diff-raw.png'}))]),

    slide([h1('Analyse multi-facettes: implémentation'), figure(img({src: 'img/diff-tangled.svg'}))]),

    slide([
      h1("Mêler interpréteurs et analyses"),

      img({src: 'img/slipslop-3.svg',
           style: `margin: 20px 200px;`}),

      p("Inconvénients: <b>duplication</b> de code et <b>mélange</b> des préoccupations"),
    ]),

    slide([
      h1("État de l'art"),

      p("Interpréteurs extensibles <b>par construction</b>:"),

      ul([
        li("Implémentation ouverte (Rao)"),
        li("Interpréteurs réflexifs (Smith, Friedman)"),
        li("Patron interpréteur (GOF)"),
        li("Patron visiteur (GOF, Oliveira, Krishnamurthi)"),
        li("Algèbres d'objets (Oliveira & Cook)"),
        li("Free monad (Swierstra)"),
      ]),

      vspace(20),

      p("Programmation par aspects [TLT10]:"),
      ul([
        li("Overhead: 500% à 1500%"),
        li("Solution surdimensionnée"),
      ]),

      note([
        "existing interpreters/constructed extensible"
      ])
    ]),

    slide([
      h1("Détourner l'interpréteur: les objectifs"),

      p(img({src: 'img/big-picture.svg',
             style: `margin-left: 150px`})),

      ul([
        li("Rapidité de prototypage"),
        li("Minimiser la duplication de code"),
        li("Séparer les analyses pour pouvoir les auditer"),
        li("Solution pragmatique"),
      ]),

      vspace(20),

      note([
        "infinite number of correct programs",
        "fewer canonical solutions, like fractions"
      ])
    ]),


    numsec('2', "Construire un interpréteur par modules",
           img({src: 'img/foal-blocks.svg',
                style: `display: block;
                        margin: 50px auto;`})),

    slide([
      h1(`Un module JavaScript est un objet`),

      content(pre(code(`var m = {
  parse(file) { ... },
  exec(ast) { ... },
}`))),

      p("Retourné par une fonction immédiatement invoquée:"),

      content(pre(code(`var m = (function(){
  function parse(file) { ... }
  function exec(ast) { ... }

  return <em>{ parse, exec }</em>
}())`))),


      p("Ou par une fonction avec argument:"),

      content(pre(code(`var M = function(opts) { ... return { parse, exec } }
var m = M({...})`))),

    ]),

    slide([
      h1("Un langage d'expressions arithmétiques"),

      content(pre(code(html_escape(`
<term> ::= <num>
         | <term> + <term>
<num>  ::= 0 | 1 | 2 | ...

eval : Term -> Integer

show : Term -> String
`)))),

      div([
        p("Ingrédients:"),
        ul([
          li("Modules"),
          li("Délégations par prototypes"),
          li("Fermetures lexicales"),
        ]),
      ], {style: `position: absolute;
                  top: 125px;
                  right: 50px;`}),

      img({src: 'img/foal-lang-1.svg',
           style: `position: absolute;
                   width: 250px;
                   left: 80px;
                   bottom: 50px;`}),

    ]),

    slide([
      h1(`Le module ${code('num')}`),

      img({src: 'img/foal-lang-2.svg',
           style: `position: absolute;
                   width: 100px;
                   right: 50px;
                   top: 50px;`}),

      content(pre(code(`var num = {
  new(n) { return {__proto__: this, n } },
  eval() { return this.n }}`))),

      p(img({src: 'img/foal-1a.svg',
             style: `position: absolute;
                     left: 75px;
                      top: 350px;`})),

      img({src: 'img/foal-legend-1.svg',
           style: `position: absolute;
                   right: 50px;
                   top: 350px;`}),
    ]),

    slide([
      h1(`Le module ${code('num')}`),

      img({src: 'img/foal-lang-2.svg',
           style: `position: absolute;
                   width: 100px;
                   right: 50px;
                   top: 50px;`}),

      content(pre(code(`var num = {
  new(n) { return {__proto__: this, n } },
  eval() { return this.n }}

<em>var e1 = num.new(3)
e1.eval() //: 3</em>`))),

      p(img({src: 'img/foal-1b.svg',
             style: `position: absolute;
                     left: 75px;
                      top: 350px;`})),

      img({src: 'img/foal-legend.svg',
           style: `position: absolute;
                   right: 50px;
                   top: 350px;`}),

    ]),

    slide([
      h1(`Ajouter le module ${code('plus')}`),

      img({src: 'img/foal-lang-3.svg',
           style: `position: absolute;
                   width: 175px;
                   right: 50px;
                   top: 50px;`}),

      content(pre(code(`var plus = {
  new(l, r) { return {__proto__: this, l, r } },
  eval() { return this.l.eval() + this.r.eval() }}

var e2 = plus.new(num.new(1), num.new(2))
e2.eval() //: 3`))),

      vspace(10),

      p(img({src: 'img/foal-2.svg'})),

      note("Explain diagram language"),

    ]),

//     slide([
//       h1("Ajouter une opération, rétroactivement"),

//       img({src: 'img/foal-lang-4.svg',
//            style: `position: absolute;
//                    width: 175px;
//                    right: 50px;
//                    top: 50px;`}),

//       content(pre(code(`<em>num.show =</em> function() {
//   return this.n.toString() }
// <em>plus.show =</em> function() {
//   this.l.show() + '+' + this.r.show() }

// plus.new(num.new(1), num.new(2)).show() //: "1+2"
// e1.show() //: "3"
// e2.show() //: "1+2"`))),

//       p(img({src: 'img/foal-3.svg'})),

//       note('quite natural in JS'),
//     ]),

    slide([
      h1("Ajouter le module <code>show</code>"),

      img({src: 'img/foal-lang-4.svg',
           style: `position: absolute;
                   width: 175px;
                   right: 50px;
                   top: 50px;`}),

      content(pre(code(`var show = <em>function(base) {</em>
  var num = {__proto__: base.num,
    show() { return this.n.toString() }}
  var plus = {...}
  return {num, plus}
<em>}</em>
var s = show({num, plus})
e2.show() //: undefined
s.plus.new(s.num.new(1), s.num.new(2)).show() //: "1+2"
s.plus.new(s.num.new(1), s.num.new(2)).eval() //: 3`))),

      p(img({src: 'img/foal-4a.svg'}))
    ]),

    slide([
      h1("Ajouter le module <code>show</code>"),

      img({src: 'img/foal-lang-4.svg',
           style: `position: absolute;
                   width: 175px;
                   right: 50px;
                   top: 50px;`}),

      content(pre(code(`var show = function(base) {
  var num = {__proto__: base.num,
    show() { return this.n.toString() }}
  var plus = {...}
  return {num, plus}
}
<em>var s = show({num, plus})</em>
e2.show() //: undefined
s.plus.new(s.num.new(1), s.num.new(2)).show() //: "1+2"
s.plus.new(s.num.new(1), s.num.new(2)).eval() //: 3`))),

      p(img({src: 'img/foal-4.svg'})),

      note([
        "Syntaxic noise of s.plus, s.new...",
      ]),
    ]),

//     slide([
//       h1("Ajouter le module <code>show</code>"),

//       img({src: 'img/foal-lang-4.svg',
//            style: `position: absolute;
//                    width: 175px;
//                    right: 50px;
//                    top: 50px;`}),

//       content(pre(code(`var show = function(base) {
//   var num = {__proto__: base.num,
//     show() { return this.n.toString() }}
//   var plus = {...}
//   return {num, plus}}
// <em>var s = show({num, plus})</em>
// e2.show() //: undefined

// s.plus.new(s.num.new(1), s.num.new(2)).show() //: "1+2"
// s.plus.new(s.num.new(1), s.num.new(2)).eval() //: 3`))),

//       p(img({src: 'img/foal-4.svg'})),

//       img({src: 'img/foal-3.svg',
//            style: `position: absolute;
//                    bottom: 5px;
//                    right: 75px;`}),

//       note([
//         "Syntaxic noise of s.plus, s.new...",
//       ]),
//     ]),

//     slide([
//       h1("Problème: mixer les modules"),

//       content(pre(code(`<em>s</em>.plus.new(num.new(1), <em>s</em>.num.new(2)).show()

// //: TypeError: this.l.show is not a function`))),

//       p("Problème de types:"),

//       content(pre(code(`plus.new: Term -> Term -> Term
// s.plus.new: Show -> Show -> Show
// `))),

//     ]),

    slide([
      h1(`Réduire le bruit syntaxique`),

      p("Le but <code>with</code> en JavaScript:"),

      pre(code(`canvas.begin()
canvas.setColor(...)
canvas.drawRectangle(...)
canvas.setColor(...)
canvas.drawCircle(...)
canvas.finish()`),
          {style: `position: absolute;
                   left: 50px;
                   top: 200px;`}),

      img({src: 'img/right-arrow.svg',
           style: `position: absolute;
                   height: 100px;
                   left: 390px;
                   top: 230px`}),

      pre(code(`with (canvas) {
  begin()
  setColor(...)
  drawRectangle(...)
  setColor(...)
  drawCircle(...)
  finish()
}`),
          {style: `position: absolute;
                   right: 75px;
                   top: 200px;`}),
    ]),

    slide([
      h1("<code>with</code> crée un environnement"),

      p("Équivalent à un appel de fonction:"),

      img({src: 'img/with-2.svg',
           style: `margin: 0 50px;`}),
      img({src: 'img/with-3.svg',
           style: `margin: 0 100px;`}),

      img({src: 'img/with-1.svg',
           style: `position: absolute;
                   left: 70px;
                   top: 400px;`}),

      img({src: 'img/with-4.svg',
           style: `position: absolute;
                   left: 450px;
                   top: 400px;`}),

    ]),

    slide([
      h1(`${code('with')} pour activer un module`),

      content(pre(code(`<em>with(show({num, plus})) {</em>
  plus.new(num.new(1), num.new(2)).show()
<em>}</em>`))),

      vspace(50),

      p(img({src: 'img/foal-5.svg'})),

    ]),

    slide([
      h1("Modifier des modules existants"),

      img({src: 'img/foal-lang-5.svg',
           style: `position: absolute;
                   width: 250px;
                   left: 50px;
                   top: 200px;`}),

      img({src: 'img/foal-lang-7.svg',
           style: `position: absolute;
                   width: 300px;
                   right: 50px;
                   top: 200px;`}),
    ]),

  //   slide([
  //     h1("Doubler les constantes"),

  //     img({src: 'img/foal-lang-5.svg',
  //          style: `position: absolute;
  //                  width: 175px;
  //                  right: 50px;
  //                  top: 50px;`}),

  //     pre(code(`var double = function(base) {
  // var num = {
  //   __proto__: base.num,
  //   eval() { return base.num.eval.call(this) * 2 }}
  // return {__proto__: base, num}}`),
  //         {style: `margin-left: 50px`}),
  //   ]),

//     slide([
//       h1("Doubler les constantes"),

//       img({src: 'img/foal-lang-5.svg',
//            style: `position: absolute;
//                    width: 175px;
//                    right: 50px;
//                    top: 50px;`}),

//       pre(code(`var double = function(base) {
//   var num = {
//     __proto__: base.num,
//     eval() { return base.num.eval.call(this) * 2 }}
//   return {__proto__: base, num}}

// <em>with (double({num})) {</em>
//   plus.new(num.new(1), num.new(2)).eval() //: 6
// <em>}</em>`),
//           {style: `margin-left: 50px`}),

//       p(img({src: 'img/foal-6a.svg'})),

//     ]),

    slide([
      h1("Doubler les constantes"),

      img({src: 'img/foal-lang-5.svg',
           style: `position: absolute;
                   width: 175px;
                   right: 50px;
                   top: 50px;`}),

      pre(code(`var double = function(base) {
  var num = {
    __proto__: base.num,
    eval() { return <em>base.num.eval.call(this) * 2</em> }}
  return {__proto__: base, num}}

with (double({num})) {
  plus.new(num.new(1), num.new(2)).eval() <em>//: 6</em>
}`),
          {style: `margin-left: 50px`}),

      p(img({src: 'img/foal-6b.svg'})),

    ]),


    slide([
      h1("Combiner les modules"),

      img({src: 'img/foal-lang-8.svg',
           style: `position: absolute;
                   width: 185px;
                   right: 50px;
                   top: 50px;`}),

      vspace(50),

      content(pre(code(`with (<em class="orange">double</em>({num})) {
  with (<em class="orange">double</em>({num})) {
    with (<em class="orange">double</em>({num})) {
      plus.new(num.new(1), num.new(2)).eval() //: 24`))),

      note(['2*2*2 = 8x']),

    ]),

//     slide([
//       h1("Ajouter de l'état"),

//       img({src: 'img/foal-lang-7.svg',
//            style: `position: absolute;
//                    width: 185px;
//                    right: 30px;
//                    top: 50px;`}),

//       content(pre(code(`var state = function(base, <em>count = 0</em>) {
// var num = {__proto__: base.num,
//            eval() {
//              <em>count++</em>;
//              return base.num.eval.call(this) }},
// var plus = {...}
// var <em>getCount</em> = function() { return <em>count</em> }

// return {__proto__: base, num, plus, getCount}}`))),
//     ]),

    slide([
      h1("Ajouter de l'état"),

      img({src: 'img/foal-lang-7.svg',
           style: `position: absolute;
                   width: 185px;
                   right: 30px;
                   top: 50px;`}),

      content(pre(code(`var state = function(base, <em>count = 0</em>) {
var num = {__proto__: base.num,
           eval() {
             <em>count++</em>;
             return base.num.eval.call(this) }},
var plus = {...}
var <em>getCount</em> = function() { return <em>count</em> }

return {__proto__: base, num, plus, getCount}}

with (state({num, plus})) {
  <em>getCount() //: 0</em>
  plus.new(num.new(1), num.new(2)).eval() //: 3
  <em>getCount() //: 3</em>
}`))),
    ]),

    slide([
      h1("All together now"),

      img({src: 'img/foal-lang-6.svg',
           style: `position: absolute;
                   width: 200px;
                   right: 30px;
                   top: 50px;`}),

      vspace(20),

      content(pre(code(`with (<em class="green">state</em>({<em class="beige">num</em>, <em class="beige">plus</em>})) {
  with (<em class="orange">double</em>({num})) {
    with (<em class="blue">show</em>({num, plus})) {
      getCount() //: 0
      var n = plus.new(num.new(1), num.new(2))
      n.eval() //: 6
      getCount() //: 3
      n.show() //: "1+2"
}}}`))),

      note(["Works because we defined them adequately",
            "No safeguards from interferences"]),
    ]),

    slide([
      h1("Contribution: un intepréteur modulaire"),

      p("Un schéma de composition original pour des interpréteurs modulaire"),

      vspace(20),

      p(img({src: 'img/foal-lang-6.svg',
             style: `width: 340px`})),

      div([
        p("Ingrédients:"),
        ul([
          li("Modules"),
          li("Délégation par prototypes"),
          li("Fermetures lexicales"),
        ])],
          {style: `position: absolute;
                   top: 180px;
                   left: 400px;`}),

      vspace(20),
      p(`Approche <b>bottom-up</b>: construire un interpréteur extensible`),

    ]),

    numsec('3', "Détourner Narcissus",
           img({src: 'img/narcissus-diff-after-2c.svg',
                style: `width: 300px;
                        display: block;
                        margin: 50px auto;`})),

    slide([
      h1("Narcissus est un module"),

      content(pre(code(`var Narcissus = (function(){
  var globalBase = { ... }

  function ExecutionContext(type, version) { ... }
  function getValue(v) { ... }
  function putValue(v, w) { ... }
  function evaluate(code) { ... }

  return {
    globalBase: globalBase,
    evaluate: evaluate,
    ...
  }
}())`))),
    ]),

    slide([
      h1("Problème: Narcissus est un module verrouillé"),

      content(pre(code(`var m = <em>(function(){</em>
  var a = 1
  function f(x) { return x + a }
  function g(x) { return f(x) }
  return {g: g}
<em>}())</em>

m.g(0) //: 1`))),

      p(img({src: 'img/dls0.svg',
             style: `position: absolute;
                     width: 350px;
                     top: 250px;
                     right: 80px;`})),
    ]),

    slide([
      h1("Problème: Narcissus est un module verrouillé"),

      content(pre(code(`var m = (function(){
  var a = 1
  function f(x) { return x + a }
  function g(x) { return f(x) }
  return {g: g}
}())

<em>m.g(0)</em> //: 1`))),

      p(img({src: 'img/dls0a.svg',
             style: `position: absolute;
                     width: 350px;
                     top: 250px;
                     right: 80px;`})),
    ]),

    slide([
      h1("Problème: Narcissus est un module verrouillé"),

      content(pre(code(`var m = (function(){
  var a = 1
  function f(x) { return x + a }
  function g(x) { return <em>f(x)</em> }
  return {g: g}
}())

m.g(0) //: 1`))),

      p(img({src: 'img/dls0b.svg',
             style: `position: absolute;
                     width: 350px;
                     top: 250px;
                     right: 80px;`})),
    ]),

    slide([
      h1("Solution: ouvrir le module"),

      p("<b>Supposition</b>: on dispose d'une référence <code><em>E</em></code>"),

      content(pre(code(`var m = (function(){
  var a = 1
  function f(x) { return x + a }
  function g(x) { return f(x) }
  return {g: g}
}())

m.g(0) //: 1
<em>m.E.a = 2</em>
m.g(0) //: 2`))),

      p(img({src: 'img/dls4a.svg',
             style: `position: absolute;
                     width: 350px;
                     top: 280px;
                     right: 80px;`}))
    ]),

    slide([
      h1("Solution: ouvrir le module"),

      p("<b>Supposition</b>: on dispose d'une référence <code><em>E</em></code>"),

      content(pre(code(`var m = (function(){
  var a = 1
  function f(x) { return x + a }
  function g(x) { return f(x) }
  return {g: g}
}())

m.g(0) //: 1
m.E.a = 2
<em>m.g(0) //: 2</em>`))),

      p(img({src: 'img/dls4b.svg',
             style: `position: absolute;
                     width: 350px;
                     top: 280px;
                     right: 80px;`}))
    ]),

    slide([
      h1("Problème: modifications réversibles"),

      content(pre(code(`var m = (function(){
  var a = 1
  function f(x) { return x + a }
  function g(x) { return f(x) }
  return {g: g}
}())

m.E.a = 2
<em>delete m.E.a</em>
m.g(0) <em>//: NaN</em>`))),

      p(img({src: 'img/dls4c.svg',
             style: `position: absolute;
                     width: 350px;
                     top: 250px;
                     right: 80px;`}))
    ]),

    slide([
      h1("Solution: ajouter un environnement frontal"),

      content(pre(code(`var m = (function(){
  var a = 1
  function f(x) { return x + a }
  function g(x) { return f(x) }
  return {g: g}
}())

m.g(0) //: 1`))),

      p(img({src: 'img/dls7a.svg',
             style: `position: absolute;
                     width: 350px;
                     top: 250px;
                     right: 80px;`})),
    ]),

    slide([
      h1("Solution: ajouter un environnement frontal"),

      content(pre(code(`var m = (function(){
  var a = 1
  function f(x) { return x + a }
  function g(x) { return f(x) }
  return {g: g}
}())

m.g(0) //: 1
<em>m.E.a = 2
m.g(0) //: 2</em>
delete m.E.a
m.g(0) //: 1`))),

    p(img({src: 'img/dls7b.svg',
           style: `position: absolute;
                     width: 350px;
                     top: 250px;
                     right: 80px;`})),
  ]),

    slide([
      h1("Solution: ajouter un environnement frontal"),

      content(pre(code(`var m = (function(){
  var a = 1
  function f(x) { return x + a }
  function g(x) { return f(x) }
  return {g: g}
}())

m.g(0) //: 1
m.E.a = 2
m.g(0) //: 2
<em>delete m.E.a
m.g(0) //: 1</em>`))),

      p(img({src: 'img/dls7c.svg',
             style: `position: absolute;
                     width: 350px;
                     top: 250px;
                     right: 80px;`})),
    ]),

    slide([
      h1("Combiner les extensions"),

      content(pre(code(`var m = (function(){ ... }())

m.g(0) //: 1

var e1 = <em>{ a: 2, f(x) {
  return x + 2 * m.E.a }}</em>
pushEnv(e1, m.E)
m.g(0) //: 4`))),

      p(img({src: 'img/dls8a.svg',
             style: `position: absolute;
                     width: 300px;
                     top: 180px;
                     right: 80px;`}))

    ]),

    slide([
      h1("Combiner les extensions"),

      content(pre(code(`var m = (function(){ ... }())

m.g(0) //: 1

var e1 = { a: 2, f(x) {
  return x + 2 * m.E.a }}
<em>pushEnv(e1, m.E)</em>
m.g(0) //: 4`))),

      p(img({src: 'img/dls8b.svg',
             style: `position: absolute;
                     width: 300px;
                     top: 180px;
                     right: 80px;`}))

    ]),

    slide([
      h1("Combiner les extensions"),

      content(pre(code(`var m = (function(){ ... }())

m.g(0) //: 1

var e1 = { a: 2, f(x) {
  return x + 2 * m.E.a }}
pushEnv(e1, m.E)
<em>m.g(0) //: 4</em>`))),

      p(img({src: 'img/dls8c.svg',
             style: `position: absolute;
                     width: 300px;
                     top: 180px;
                     right: 80px;`}))

    ]),

    slide([
      h1("Combiner les extensions"),

      content(pre(code(`var m = (function(){ ... }())

m.g(0) //: 1

var e1 = { a: 2, f(x) {
  return x + 2 * m.E.a }}
pushEnv(e1, m.E)
m.g(0) //: 4

<em>var e2 = { f(x) {
  return -m.E.a }}
pushEnv(e2, m.E)</em>
m.g(0) //: -2

removeEnv(e1, m.E)
m.g(0) //: -1`))),

      p(img({src: 'img/dls8d.svg',
             style: `position: absolute;
                     width: 300px;
                     top: 180px;
                     right: 80px;`}))

    ]),

    slide([
      h1("Combiner les extensions"),

      content(pre(code(`var m = (function(){ ... }())

m.g(0) //: 1

var e1 = { a: 2, f(x) {
  return x + 2 * m.E.a }}
pushEnv(e1, m.E)
m.g(0) //: 4

var e2 = { f(x) {
  return -m.E.a }}
pushEnv(e2, m.E)
m.g(0) //: -2

<em>removeEnv(e1, m.E)</em>
m.g(0) //: -1`))),

      p(img({src: 'img/dls8e.svg',
             style: `position: absolute;
                     width: 300px;
                     top: 180px;
                     right: 80px;`}))

    ]),

    slide([
      h1(`Ouvrir le module avec ${code('with')}`),

      content(pre(code(`var m = (function(){
  <em>var E = Object.create(null)</em>
  <em>with (E) {</em>
    var a = 1
    function f(x) { return x + a }
    function g(x) { return f(x) }
    return { g: g, <em>E: E</em> }
  <em>}</em>
}())

m.g(0) //: 1
m.E.a = 2
m.g(0) //: 2`))),

      p(img({src: 'img/dls11.svg',
             style: `position: absolute;
                     width: 350px;
                     top: 310px;
                     right: 80px;`}))
    ]),

    slide([
      h1("Ouvrir Narcissus"),

      content(pre(code(`Narcissus.interpreter = (function(){
<em>+  var _env = Object.create(null)</em>
<em>+  with (_env) {</em>

   ... /* 1500 lignes de code */ ...

<em>+  var _parent = { ... }</em>
<em>+  Object.setPrototypeOf(_env, _parent);</em>
   return {
     evaluate: evaluate,
     ...
<em>+    _env: _env</em>
   };
<em>+  }</em>
}())`)))
    ]),

    slide(figure(img({src: 'img/narcissus-diff-after-1.svg'}))),

    slide(img({src: 'img/narcissus-diff-after-2.svg',
               style: `width: 750px;
                       display: block;
                       margin: 75px auto;`})),

    slide(img({src: 'img/narcissus-diff-after-2b.svg',
               style: `width: 750px;
                       display: block;
                       margin: 75px auto;`})),

    slide([
      h1("Modifications supplémentaires"),

      p("Nommer une variable:"),

      content(pre(code(`-  putstr(<em>"njs> "</em>)

+  var repl_prompt = "njs> "
+  putstr(repl_prompt)`))),

      vspace(15),

      p("Retarder la finalisation:"),

      pre(code(`(function(){
  reflectArray()
  reflectFunction()
  ...
}())`), {style: `margin-left: 50px; vertical-align: top;`}),

      pre(code(`(function(){
  <em>function populateEnv() { ... }</em>
}())

load("facets-analysis.js")
<em>Narcissus.populateEnv()</em>`),
          {style: `margin-left: 75px;`}),

    ]),

    slide([
      h1("Évaluation"),

      p("Suite de conformité test262: résultats identiques"),

      tbl([
        ['Interpréteur', 'Benchmark', 'Lignes modifiées'],
        ['Narcissus', '1040 sec', '0'],
        ['Narcissus (with)', '1218 sec (+17%)', '19'],
        ['Narcissus multi-facettes (AF-12)', '1215 sec', '640'],
        ['Narcissus multi-facettes (with)', '1301 sec (+7%)', '51'],
      ]),

      img({src: 'img/diff-tangled.svg',
           style: `width: 200px;
                   position: absolute;
                   left: 80px;`}),

      img({src: 'img/right-arrow.svg',
           style: `width: 50px;
                   position: absolute;
                   bottom: 70px;
                   left: 330px;`}),

      img({src: 'img/narcissus-diff-after-2c.svg',
           style: `width: 300px;
                   position: absolute;
                   right: 80px;`}),

      note('fix a bug only once with diverting'),
    ]),


    sec("Conclusions"),

    slide([
      h1("Conclusion"),

      p("Problème: étendre des interpréteurs pour<br>sécuriser JavaScript"),

      img({src: 'img/slipslop-3.svg',
           style: `width: 200px;
                   position: absolute;
                   top: 120px;
                   right: 50px;`}),

      vspace(30),
      p("Contributions:"),

      ul([
        li(["Construire un interpréteur extensible",

            img({src: 'img/foal-lang-6.svg',
                 style: `width: 200px;
                         vertical-align: middle;
                         position: relative;
                         left: 115px;`})
           ]),

        vspace(60),
        li(["Détourner Narcissus pour le rendre extensible",

            img({src: 'img/narcissus-diff-after-2c.svg',
                 style: `width: 200px;
                         position: absolute;
                         top: 450px;
                         right: 50px;`})
           ]),
      ]),
    ]),

    slide([
      h1("Perspectives"),

      ul([

        li("Comparaison d'analyses de flot"),

        li("Application à V8/SpiderMonkey"),

        li("Généralisation à des programmes quelconques"),
      ]),


    ]),

    sec("Q & A"),

    slide([
      h1("<code>with</code> != portée dynamique"),

    ]),

    slide([
      h1("Portée dynamique: heureux accident"),
    ]),

    slide([
      h1("Distinction objet et environnement"),

      p("Pas si élégant"),
    ]),

    slide([
      h1("Interférences entre modules"),

      p("No safeguards"),
      p("Have to write the modules carefully to allow composition"),
      p("Same problems with Aspects"),
    ]),

    slide([
      h1("Contrôler le détournement"),

      p(`Possible de retourner un proxy sur l'objet scope qui empêche
         de modifier n'importe quelle référence, en utilisant une whitelist`),

      p("Ou bien le symbole spécial `unscopables`")
    ])

  ])
)
