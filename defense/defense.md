% Étendre des interpréteurs par détournement <br><br>ou<br><br> Comment étendre des interpréteurs sans en modifier le code
% fmdkdd
% Mines Nantes, 18 novembre 2016

<!-- TODO: fix slide numbers in overview -->
<!-- TODO: incremental overlay should start with first item, not empty -->

# Préliminaires

## Le cycle de vie d'un programme

<div class="incremental overlay">

<img src="img/problem4.svg" class="center" style="width:80%">

<img src="img/problem4b.svg" class="center" style="width:80%">

</div>

## De la spécification au processus

<div class="incremental overlay">

<img src="img/problem7.svg">

<img src="img/problem7b.svg">

<img src="img/problem7c.svg">

<img src="img/problem7d.svg">

<div class="content">
<img src="img/problem7e.svg">
<pre style="position:absolute; top: 450px; left: 350px"><code>1 + 1 == 2 //: true
"12" == 12 //: true
[] == "" //: true
</pre></code>
<video src="img/visual-6502.mp4" style="width:400px; position:absolute; left: 330px; top: 120px" loop="true">
</div>

</div>

<div role="note">
- ECMA6: 566 pages
</div>

## La correspondance processus—programme

Appuyer sur Ⓐ pour sauter

<div class="content">
<pre><code style="font-size: 16px">
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
}
</code></pre>

<pre style="position:absolute; left: 300px; top: 300px;">
<code>key: <span class="var key"></span>
jumping: <span class="var jumping"></span>
y: <span class="var y"></span>
sprite_x: <span class="var sprite_x"></span>
</code></pre>

<canvas id="jumping-jack-canvas" style="position:absolute; right: 100px; bottom: 100px;" width="200px" height="550px"></canvas>

<script>

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
</script>
</div>

<div role="note">
- All are different views of the same thing
- 3 states (ascent, descent, ground) for 3 "if" blocks
</div>

# Le problème

## Étendre des interpréteurs pour des analyses de sécurité

Context sécurité JS, SecCloud

## Modifier l'interpréteur

<img src="img/problem1b.svg">

---

![](img/narcissus-diff-annotated.png)

---

![](img/narcissus-diff.svg)

## Modifier l'interpréteur

Différentes façons de faire

Mais l'instrumentation de Narcissus n'est pas idéale dans ce contexte

On veut:

- rapidité de prototypage
- minimiser les changements du code de l'interpréteur pour ne pas complexifier
  le code
- séparer le code des analyses pour pouvoir les auditer séparément

<div role="note">
Refactor fails the first two counts
</div>

## Détourner l'interpréteur

Venir se brancher juste au bon endroit
-> rapidité
-> changement de code minimes
-> code des analyses séparé

<img src="img/problem2.svg">

# Construire un interpréteur par modules

## Utiliser `with`

<img src="img/foal-5.svg">

# Étendre Narcissus par manipulation de portée

## Le motif module

Complexité supplémentaire de Narcissus

Le motif module verrouille l'extension

## Ouvrir le motif module

<img src="img/dls12.svg">


## Évaluation

- 4 analyses ajoutées
- XX lignes modifiées (vizu du diff avant/après?)

- spécifique à ce cas précis

# Conclusions

## Détourner pour étendre et modifier un programme

Plus rapide et moins risqué que la refactorisation.  Choix pragmatique dans les
des circonstances adéquantes.

Pas une balle en argent: spécifique à chaque scénario

## Indirection -> détournement

N'importe quel mécanisme d'indirection suffit pour le détournement.

`with`, inversion of control, AspectJ, ...

## Détournement -> indirection

Détourner c'est laisser un trou béant, c'est casser la membrane du module

L'un ne va pas sans l'autre

# Extra credit

## Contrôler le détournement

Possible de retourner un proxy sur l'objet scope qui empêche de modifier
n'importe quelle référence, en utilisant une whitelist par exemple.

Ou bien le symbole spéciale `unscopables`.
