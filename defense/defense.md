% Étendre des interpréteurs par détournement <br><br>ou<br><br> Comment étendre des interpréteurs sans en modifier le code
% fmdkdd
% Mines Nantes, 18 novembre 2016

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
<video src="img/visual-6502.mp4" style="width:62%">
</div>

</div>

<div role="note">
- ECMA6: 566 pages
</div>

# Le problème

## Modifier l'interpréteur

<img src="img/problem1b.svg">

---

![](img/narcissus-diff-annotated.png)

---

![](img/narcissus-diff.svg)

## Détourner l'interpréteur

<img src="img/problem2.svg">

# Construire un interpréteur par modules

## Utiliser `with`

<img src="img/foal-5.svg">

# Étendre Narcissus par manipulation de portée

## Ouvrir le motif module

<img src="img/dls12.svg">
