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

<div>
<img src="img/problem7e.svg">
<video src="img/visual-6502.mp4" style="width:62%" loop="true">
</div>

<div class="content">
<img src="img/problem7e.svg">
<pre style="margin-left:80px"><code>1 + 1 == 2 //: true
"12" == 12 //: true
[] == "" //: true





</pre></code>
</div>

</div>

<div role="note">
- ECMA6: 566 pages
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
