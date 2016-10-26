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
      ]),

      note("How I see the activity of a programmer"),
    ]),

    slide([
      h1("De la spécification au processus"),

      content(
      overlay([
        img({src: 'img/problem7.svg'}),
        img({src: 'img/problem7b.svg'}),
        img({src: 'img/problem7c.svg'}),
        img({src: 'img/problem7d.svg'}),

        div([
          img({src: 'img/problem7e.svg'}),
          video({src: 'img/visual-6502.mp4',
                 loop: true,
                 style: `width: 400px;
                         position: absolute;
                         left: 330px;
                         top: 120px;`}),

          pre(code(`1 + 1 == 2 //: true
"12" == 12 //: true
[] == "" //: true
`),
              {style: `position: absolute;
                       top: 450px;
                       left: 350px`})
        ])
      ])),

      note([
        "ECMA6: 566 pages; spec rarely well-defined",
        "spec -> code is wonky",
        "code is what the programmer writes",
        "but the process is what really happens",
        "the question is always: process == spec?"
      ])
    ]),

    slide([
      h1("La correspondance processus-programme"),

      p("Appuyer sur Ⓐ pour sauter"),

      content([
        pre(code(`
function loop() {
  <span class="if jumping">if (jumping) {
    y += 32
    sprite_x = 160
  }</span>

  <span class="if positive-y">if (y > 0) {
    y -= 12
  }</span>
  <span class="if touch-ground">else {
    y = 0
    sprite_x = 80
  }</span>
}`, {style: 'font-size: 16px'})),

        pre(code(`key: <span class="var key"></span>
jumping: <span class="var jumping"></span>
y: <span class="var y"></span>
sprite_x: <span class="var sprite_x"></span>`),
            {style: `position: absolute;
                     left: 300px;
                     top: 300px`}),

        canvas({id: 'jumping-jack-canvas',
                width: '200px',
                height: '550px',
                style: `position: absolute;
                        right: 100px;
                        bottom: 100px`}),

        // Magic code injection
        script(`${jumping_canvas}; jumping_canvas()`)
      ]),

      note([
        "All are different views of the same thing",
        "3 states (ascent, descent, ground) for 3 `if` blocks"
      ])
    ]),

    slide([
      h1("Les buts du programmeur"),

      p(b('Correction:')),
      p('Élaborer un programme conforme à la spécification'),

      p(b('Clarté:')),
      p(`Établir une correspondance claire entre le programme
         et le processus`),

      note([
        "infinite number of correct programs",
        "fewer canonical solutions, like fractions"
      ])
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
      ]),

      note("clarity: matching code with intent")
    ]),


    sec("Construire un interpréteur par modules"),

    slide([
      h1(`Utiliser ${code('with')}`),

      p(img({src: 'img/foal-5.svg'})),

    ]),


    sec("Étendre Narcissus par manipulation de portée"),

    slide([
      h1("Le motif module"),

      p("Complexité supplémentaire de Narcissus"),
      p("Verrouille l'extension")
    ]),

    slide([
      h1("Ouvrir le motif module"),

      p(img({src: 'img/dls12.svg'}))
    ]),

    slide([
      h1("Évaluation"),

      ul([
        li("4 analyses ajoutées"),
        li("XX lignes modifiées"),
        li("spécifique à ce cas précis")
      ])
    ]),

    slide(figure(img({src: 'img/narcissus-diff-after.svg'}))),

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

    sec("Extra credit"),

    slide([
      h1("Contrôler le détournement"),

      p(`Possible de retourner un proxy sur l'objet scope qui empêche
         de modifier n'importe quelle référence, en utilisant une whitelist`),

      p("Ou bien le symbole spécial `unscopables`")
    ])

  ])
)

function jumping_canvas() {
  var sprites = new Image()
  sprites.src = 'img/mario-sprites.png'

  var canvas = document.getElementById('jumping-jack-canvas')
  var ctxt = canvas.getContext('2d')
  ctxt.mozImageSmoothingEnabled = false;
  var height = canvas.height
  var width = canvas.width
  var x = width / 2
  var y = 0
  var jumping = false
  var sprite_x = 80
  var last_key = null

  document.addEventListener('keydown', function(ev) {
    if (ev.which === 65) {
      jumping = true
    }
    last_key = ev.which
  })
  document.addEventListener('keyup', function(ev) {
    if (ev.which === 65) {
      jumping = false
    }
    last_key = null
  })

  function loop() {
    // game logic
    if (jumping) {
      y += 32
      sprite_x = 160
    }

    if (y > 0) {
      y -= 12
    }

    else {
      y = 0
      sprite_x = 80
    }

    // canvas draw
    ctxt.clearRect(0, 0, 1000, 1000)
    ctxt.drawImage(sprites, sprite_x, 96, 16, 32, x - 32, height - y - 128, 64, 128)

    // code viz
    document.querySelector('.if.jumping').classList.toggle('active', jumping)
    document.querySelector('.if.positive-y').classList.toggle('active', y > 0)
    document.querySelector('.if.touch-ground').classList.toggle('active', y <= 0)
    document.querySelector('.var.jumping').textContent = jumping
    document.querySelector('.var.key').textContent = last_key
    document.querySelector('.var.y').textContent = y
    document.querySelector('.var.sprite_x').textContent = sprite_x

    requestAnimationFrame(loop)
  }

  loop()
}
