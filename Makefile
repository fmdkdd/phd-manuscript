.PHONY: clean draft final

ORG_SRC=lab/html-export.org

# Extract all multi SVG images from svg/ folder into img/ folder.  Copy plain
# SVG so that all reside in img/.
SVG_SRC=$(wildcard svg/*.svg)
SVG_DST=$(patsubst svg/%.svg, img/%.svg, $(SVG_SRC))
PNG_DST=$(patsubst svg/%.svg, img/%.png, $(SVG_SRC))

draft: lab/html-export.html $(SVG_DST)
final: lab/html-export.html $(SVG_DST)

lab/html-export.html: $(ORG_SRC) refs.bib html-export-setup.el
	echo 'Exporting to HTML...'
	@emacs --quick --batch \
         --load html-export-setup.el \
         --file $(ORG_SRC) \
         --eval '(message (format "Org version %s" (org-version)))' \
         --eval '(org-html-export-to-html)'

# Org creates the HTML in the same directory as the Org document.  Maybe there
# is a way to override it with ELisp, but for now...
#  @mv manuscript.html html/manuscript.html

# Extract individual SVG from SVG containing multiple diagrams with Inkscape.
img/%.multi.svg: svg/%.multi.svg svgsplit
	./svgsplit svg $< img
  # We actually create multiple files, and we can't know their names from the
  # Makefile.  So we use a phony file to know when we need to keep track of
  # the last time we ran the command.
	@touch $@

img/%.svg: svg/%.svg
	cp $< $@

# Same as above, but for the PNG exports.
img/%.multi.png: svg/%.multi.svg svgsplit
	./svgsplit png $< img
	@touch $@

img/%.png: svg/%.svg
	rsvg-convert --format png --output $@ $<

clean:
	rm --force html/manuscript.html
	rm --force img/*.svg
	rm --force img/*.png
	rm --force img/*.pdf
