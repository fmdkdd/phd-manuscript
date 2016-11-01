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

// I don't put any children in these, but they still need to be closed
var video   = content_tag.bind(null, 'video', null)
var canvas  = content_tag.bind(null, 'canvas', null)

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

    title(`Étendre des interpréteurs par détournement`,
          'fmdkdd',
          'Mines Nantes, 18 novembre 2016'),

    slide([
      h1("Le plan"),

      ol([
        li("Contexte: sécuriser JavaScript"),
        li("Problème: étendre des interpréteurs"),
        li("Contributions: le détournement de programmes"),
        ol([
          li("Étendre des interpréteurs par module"),
          li("Détourner Narcissus"),
        ]),
      ])
    ]),

    sec('Contexte: sécuriser JavaScript'),

    slide([
      h1('Étendre des interpréteurs pour sécuriser le nuage'),

      p(`Projet ${b('SecCloud')} du labex CominLabs (2012-2016)`),

      content([
        img({src: 'img/chrome-logo.svg',
             style: 'width: 100px'}),
        p('Sécuriser les applications web exécutées dans les navigateurs...',
          {style: `display: inline-block;
                   width: 440px;
                   margin: 80px 20px;
                   position: relative;
                   top: -20px;`}),

        img({src: 'img/js.png',
             style: 'width: 100px'}),
        p('...en analysant les programmes JavaScript',
          {style: `display: inline-block;
                   width: 440px;
                   margin: 20px;
                   position: relative;
                   top: -30px;`})
      ])
    ]),

    slide([
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

      p("Interpréteur JavaScript meta-circulaire par Mozilla"),

      p("Idéal pour prototyper des extensions au langage"),

      p(`Utilisé par Austin et Flanagan pour implémenter
         l'${em("analyse multi-facettes")}`)
    ]),

    slide([
      h1("Analyses dynamiques de programme"),

      p("Analyser le code source pour en déduire le comportement"),

      p(`Analyse de ${b("flot d'information")}:`),

      // TODO: arrows to indicate flow
      pre(code(`var a = "1a2b4d"
var b = "3f56e7"
var c = a + b`)),

      p("Flot indirect"),

      pre(code(`var x = true
if (x) {
  y = false
}
`))


    ]),

    slide([
      h1("Analyse multi-facettes"),

      p("Analyse dynamique de flot d'information (Austin et Flanagan 2012)"),

      p(img({src: "img/facettes.svg"})),

      ul([
        li("Chaque valeur a deux facettes"),
        li("La facette privée est visible par le principal"),
        li(`Le ${b("program counter")} suit les flots indirects`)
      ])
    ]),

    slide([
      h1('Analyse multi-facettes'),

      p("Analyse de flot d'information (Austin et Flanagan 2012)"),

      p(img({src: 'img/fenton-example.svg',
             style: 'margin: 40px 0'})),
    ]),

    slide([
      h1("Modifier l'interpréteur"),

      p("Implémenter des analyses en modifiant l'interpréteur:"),

      // TODO: simpler diagrams since the cycle was not presented
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

      note([
        "infinite number of correct programs",
        "fewer canonical solutions, like fractions"
      ])
    ]),

    slide([
      h1("Les approches existantes"),

      p("AOP"),
      p("Interpréteurs refléxifs"),

      note([
        "existing interpreters/constructed extensible"
      ])
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
      ]),

      note("clarity: matching code with intent")
    ]),


    sec("Construire un interpréteur par modules"),

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
          li("Objets dictionnaires"),
          li("Délégations par prototypes"),
          li("Fermetures"),
          li("Portée dynamique")
        ]),
      ], {style: `position: absolute;
                  top: 125px;
                  right: 50px;`}),

      img({src: 'img/foal-language.svg',
           style: `position: absolute;
                   width: 300px;
                   left: 80px;
                   bottom: 50px;`}),

    ]),

    // TODO: minimap of terms in corner

    slide([
      h1(`Le terme ${code('num')}`),

      content(pre(code(`var num = {
  new(n) { return {__proto__: this, n } },
  eval() { return this.n }}

var e1 = num.new(3)
e1.eval() //: 3`))),

      p(img({src: 'img/foal-1.svg'}))
    ]),

    slide([
      h1(`Ajouter le terme ${code('plus')}`),

      content(pre(code(`var plus = {
  new(l, r) { return {__proto__: this, l, r } },
  eval() { return this.l.eval() + this.r.eval() }}

var e2 = plus.new(num.new(1), num.new(2))
e2.eval() //: 3
e1.eval() //: 3`))),

      p(img({src: 'img/foal-2.svg'}))

    ]),

    slide([
      h1("Ajouter une opération, rétroactivement"),

      content(pre(code(`num.show = () => this.n.toString()
plus.show = () => this.l.show() + '+' + this.r.show()

plus.new(num.new(1), num.new(2)).show() //: "1+2"
e1.show() //: "3"
e2.show() //: "1+2"`))),

      p(img({src: 'img/foal-3.svg'}))

    ]),

    slide([
      h1("Ajouter une opération comme module"),

      content(pre(code(`var show = base => {
  var num = {__proto__: base.num,
    show() { return this.n.toString() }}
  var plus = {...}
  return {num, plus}}

var s = show({num, plus})
e2.show() //: undefined

s.plus.new(s.num.new(1), s.num.new(2)).show() //: "1+2"
s.plus.new(s.num.new(1), s.num.new(2)).eval() //: "1+2"`))),

      p(img({src: 'img/foal-4.svg'}))
    ]),

    slide([
      h1("Problème: mixer les modules"),

      content(pre(code(`s.plus.new(num.new(1), s.num.new(2)).show()

//: TypeError: this.l.show is not a function

plus.new: Term -> Term -> Term
s.plus.new: Show -> Show -> Show
`))),

    ]),

    slide([
      h1(`La construction ${code('with')}`),

    ]),

    slide([
      h1(`${code('with')} à la rescousse`),

      content(pre(code(`with(show({num, plus})) {
plus.new(num.new(1), num.new(2)).show() }`))),

      p(img({src: 'img/foal-5.svg'})),

    ]),

    slide([
      h1("Modifier l'interpréteur"),

      p(img({src: 'img/foal-ext-language.svg'})),
    ]),

    slide([
      h1("Modifier des opérations"),

      content(pre(code(`var double = base => {
  var num = {__proto__: base.num,
    eval() { return base.num.eval.call(this) * 2 }}

  return {__proto__: base, num}}

with (double({num})) {
  plus.new(num.new(1), num.new(2)).eval() //: 6
}
plus.new(num.new(1), num.new(2)).eval() //: 3`))),

      p(img({src: 'img/foal-6.svg'})),

    ]),

    slide([
      h1("Combiner les modifications"),

      content(pre(code(`with(double({num})) {
  with (double({num})) {
    with (double({num})) {
      plus.new(num.new(1), num.new(2)).eval() //: 24`))),

    ]),

    slide([
      h1("Ajouter de l'état"),

      content(pre(code(`var state = (base, count = 0) => {
var num = {__proto__: base.num,
           eval() {
             count++;
             return base.num.eval.call(this) }},

var plus = {...}
var getCount = () => count

return {__proto__: base, num, plus, getCount}}

with (state({num, plus})) {
  getCount() //: 0
  plus.new(num.new(1), num.new(2)).eval() //: 3
  getCount() //: 3
}`))),
    ]),

    slide([
      h1("All together now"),

      content(pre(code(`with (state({num, plus})) {
  with (double({num})) {
    with (show({num, plus})) {
      getCount() //: 0
      var n = plus.new(num.new(1), num.new(2))
      n.eval() //: 6
      getCount() //: 3
      n.show() //: "1+2"
}}}`))),
    ]),

    slide([
      h1("Un interpréteur modulaire"),

      p("Ingrédients:"),
      ul([
        li("Objets dictionnaires"),
        li("Délégations par prototypes"),
        li("Fermetures"),
        li(`Portée dynamique (${code('with')})`)
      ]),

      p(img({src: 'img/foal-full-language.svg',
             style: `width: 350px;
                     position: absolute;
                     top: 150px;
                     right: 80px;`})),
    ]),

    sec("Étendre Narcissus par manipulation de portée"),

    slide([
      h1("Le motif module dans Narcissus"),

      p("Verrouille l'extension"),

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
      h1("La portée dans le motif module"),

      content(pre(code(`var m = (function(){
  var a = 1
  function f(x) { return x + a }
  function g(x) { return f(x) }
  return {g: g}
}())

m.g(0) //: 1`))),

      p(img({src: 'img/dls0.svg'}))
    ]),

    slide([
      h1("Ouvrir le motif module"),

      content(pre(code(`var m = (function(){
  var a = 1
  function f(x) {
    return x + a }
  function g(x) {
    return f(x) }
  return {g: g}
}())

m.g(0) //: 1
m.E.a = 2
m.g(0) //: 2`))),

      p(img({src: 'img/dls4.svg',
             style: `position: absolute;
                     width: 350px;
                     top: 180px;
                     right: 80px;`}))
    ]),

    slide([
      h1("Ajouter un environnement frontal"),

      content(pre(code(`var m = (function(){ ... }())

m.g(0) //: 1
m.E.a = 2
m.g(0) //: 2
delete m.E.a
m.g(0) //: 1`))),

      p(img({src: 'img/dls7.svg'}))
    ]),

    slide([
      h1(`Ouvrir le motif module avec ${code('with')}`),

      content(pre(code(`var m = (function(){
  var E = Object.create(null)
  with (E) {
    var a = 1
    function f(x) {
      return x + a }
    function g(x) {
      return f(x) }
    return {
      g: g,
      E: E }
  }
}())

m.g(0) //: 1
m.E.a = 2
m.g(0) //: 2`))),

      p(img({src: 'img/dls11.svg',
             style: `position: absolute;
                     width: 350px;
                     top: 230px;
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

removeEnv(e1, m.E)
m.g(0) //: -1`))),

      p(img({src: 'img/dls8.svg',
             style: `position: absolute;
                     width: 300px;
                     top: 180px;
                     right: 80px;`}))

    ]),

    slide([
      h1("Appliquer sur Narcissus"),

      content(pre(code(`Narcissus.interpreter = (function(){
+  var _env = Object.create(null)
+  with (_env) {

   ... /* 1500 lignes de code */ ...

+  var _parent = { ... }
+  Object.setPrototypeOf(_env, _parent);
   return {
     evaluate: evaluate,
     ...
+    _env: _env
   };
+  }
}())`)))
    ]),

    slide(figure(img({src: 'img/narcissus-diff-after.svg'}))),

    slide([
      h1("Évaluation"),

      ul([
        li("4 analyses ajoutées"),
        li("51 lignes de Narcissus modifiées"),
        li("résultats identiques sur test262"),
        li("7% d'overhead sur l'analyse multi-facettes")
      ])
    ]),


    sec("Conclusions"),

    slide([
      h1("Détourner pour étendre et modifier un programme"),

      p(`Plus rapide et moins risqué que la refactorisation.
         Choix pragmatique dans les circonstances adéquates`),

      p(`Pas une balle en argent: spécifique à chaque scénario`)
    ]),

    slide([
      h1("Indirection -> détournement"),

      p(`N'importe quel mécanisme d'indirection suffit pour le détournement.`),

      p(`${code('with')}, inversion of control, AspectJ, ...`)
    ]),

    slide([
      h1("Détournement -> indirection"),

      p(`Détourner c'est laisser un trou béant,
         c'est casser la membrane du module`),

      p(`L'un ne va pas sans l'autre`)
    ]),

    slide([
      h1("Perspectives"),

      p("Comparaison d'analyses de flot"),

      p("Application à V8/SpiderMonkey"),
    ]),

    sec("Extra credit"),

    slide([
      h1("Contrôler le détournement"),

      p(`Possible de retourner un proxy sur l'objet scope qui empêche
         de modifier n'importe quelle référence, en utilisant une whitelist`),

      p("Ou bien le symbole spécial `unscopables`")
    ])

  ])
)
