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

$(TARGET): $(INPUT) refs.bib $(HTML)/export-setup.el build/deps/org/org.el build/deps/htmlize/htmlize.el
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

# We need a specific org-plus-contrib version (8.3.5, as 9.0.1 fails to build)
build/deps/org/org.el: build/deps/org-plus-contrib.tar
	mkdir --parents build/deps/org
  # Extract in the given directory, forget the directory name in the archive,
  # and touch all files to avoid triggering this make target again.
	tar xf $< --directory build/deps/org --strip-components=1 --touch

build/deps/org-plus-contrib.tar:
	mkdir --parents build/deps
	wget http://orgmode.org/elpa/org-plus-contrib-20160905.tar --output-document build/deps/org-plus-contrib.tar

# HTML export requires htmlize
build/deps/htmlize/htmlize.el: build/deps/htmlize.tgz
	mkdir --parents build/deps/htmlize
  # Extract in the given directory, forget the directory name in the archive,
  # and touch all files to avoid triggering this make target again.
	tar xf $< --directory build/deps/htmlize --strip-components=1 --touch

build/deps/htmlize.tgz:
	mkdir --parents build/deps
	wget https://github.com/dunn/htmlize-mirror/archive/release/1.47.tar.gz --output-document build/deps/htmlize.tgz

clean:
	rm --force $(TARGET) \
             $(OUT)/style.css \
             $(IMG_OUT)/*.svg \
             $(IMG_OUT)/*.png \
             $(IMG_OUT)/*.jpg
