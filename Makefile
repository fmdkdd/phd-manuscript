.PHONY: clean draft final

INPUT=manuscript.org
HTML_OUTPUT=$(patsubst %.org, %.html, $(INPUT))
TARGET=$(patsubst %.org, html/%.html, $(INPUT))

# Extract all multi SVG images from svg/ folder into img/ folder.  Copy plain
# SVG so that all reside in img/.
SVG_SRC=$(wildcard svg/*.svg)
SVG_DST=$(patsubst svg/%.svg, img/%.svg, $(SVG_SRC))
PNG_DST=$(patsubst svg/%.svg, img/%.png, $(SVG_SRC))

# Draft is intended to be the quick option.  Initially, PNG export was much
# faster than SVG.  Using rsvg-convert made both options equally fast.  But I'm
# still leaving the two targets for now.
draft: $(TARGET) $(SVG_DST) html/img html/style.css
final: $(TARGET) $(SVG_DST) html/img html/style.css

$(TARGET): $(INPUT) refs.bib html-src/export-setup.el
	@echo 'Exporting to HTML...'
	@emacs --quick --batch \
         --load html-src/export-setup.el \
         --file $(INPUT) \
         --eval '(message (format "Org version %s" (org-version)))' \
         --eval '(org-html-export-to-html)'

# Org creates the HTML in the same directory as the Org document.  Maybe there
# is a way to override it with ELisp, but for now...
	mv $(HTML_OUTPUT) $(TARGET)

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

html/style.css: html-src/style.css
	cp $< $@

# img created by Org and rsvg-convert are put into the img/ folder by the
# `draft` and `final` targets.  To make standalone HTML folder to be pushed onto
# a web server, we need to copy the img folder as well.  The target is simply
# the folder.
html/img: img
	cp --recursive $< $@

clean:
	rm --force $(TARGET)
	rm --force img/*.svg
	rm --force img/*.png
	rm --force img/*.pdf
	rm --force html/style.css
	rm --force html/img/*.svg
	rm --force html/img/*.png
	rmdir html/img
