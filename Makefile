# HTML output.  Org mode generates a monolithic HTML file for the whole
# manuscript, and puts all the files for a standalone distribution in OUT.
# We copy images to IMG_OUT folder to make the OUT folder standalone.

# Directories of input files
INPUT := manuscript.org
HTML := html
IMG := img

# Directories of output files
OUT := build/html
IMG_OUT := $(OUT)/img

HTML_OUTPUT := $(patsubst %.org, %.html, $(INPUT))
TARGET := $(OUT)/index.html

# Extract all multi SVG images from IMG folder into IMG_OUT folder.  Copy plain
# SVG so that all reside in IMG_OUT.
SVG_SRC := $(wildcard $(IMG)/*.svg)
SVG_DST := $(patsubst $(IMG)/%.svg, $(IMG_OUT)/%.svg, $(SVG_SRC))
PNG_DST := $(patsubst $(IMG)/%.svg, $(IMG_OUT)/%.png, $(SVG_SRC))

# Copy all IMG/*.jpg files to IMG_OUT folder.
JPG_SRC := $(wildcard $(IMG)/*.jpg)
JPG_DST := $(patsubst $(IMG)/%.jpg, $(IMG_OUT)/%.jpg, $(JPG_SRC))

.PHONY: clean draft final dirs html

html: dirs $(SVG_DST) $(JPG_DST) $(OUT)/style.css $(TARGET)

$(TARGET): $(INPUT) refs.bib $(HTML)/export-setup.el
	@echo 'Exporting to HTML...'
	@emacs --quick --batch \
         --load $(HTML)/export-setup.el \
         --file $(INPUT) \
         --eval '(message (format "Org version %s" (org-version)))' \
         --eval '(org-html-export-to-html)'

# Org creates the HTML in the same directory as the Org document.  Maybe there
# is a way to override it with ELisp, but for now...
	mv $(HTML_OUTPUT) $(TARGET)

# Extract individual SVG from SVG containing multiple diagrams with Inkscape.
$(IMG_OUT)/%.multi.svg: $(IMG)/%.multi.svg bin/svgsplit
	./bin/svgsplit svg $< $(IMG_OUT)
  # We actually create multiple files, and we can't know their names from the
  # Makefile.  So we use a phony file to know when we need to keep track of
  # the last time we ran the command.
	@touch $@

# Copy normal SVGs
$(IMG_OUT)/%.svg: $(IMG)/%.svg
	cp $< $@

# same for JPGs
$(IMG_OUT)/%.jpg: $(IMG)/%.jpg
	cp $< $@

# Same as above, but for the PNG exports.
$(IMG_OUT)/%.multi.png: $(IMG)/%.multi.svg bin/svgsplit
	./bin/svgsplit png $< $(IMG_OUT)
	@touch $@

$(IMG_OUT)/%.png: $(IMG)/%.svg
	rsvg-convert --format png --output $@ $<

$(OUT)/style.css: $(HTML)/style.css
	cp $< $@

# Create build directories
dirs: $(OUT) $(IMG_OUT)

$(OUT):
	mkdir --parents $(OUT)

$(IMG_OUT):
	mkdir --parents $(IMG_OUT)

clean:
	rm --force $(TARGET) \
             $(OUT)/style.css \
             $(IMG_OUT)/*.svg \
             $(IMG_OUT)/*.png \
             $(IMG_OUT)/*.jpg
