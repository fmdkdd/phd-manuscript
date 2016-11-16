IMG := img
FONTS := fonts

OUT := ../build/html/defense
IMG_OUT := $(OUT)/img
FONTS_OUT := $(OUT)/fonts

TARGET := $(OUT)/index.html

# Extract all multi SVG images from IMG folder into IMG_OUT folder.  Copy plain
# SVG so that all reside in IMG_OUT.
SVG_SRC := $(wildcard $(IMG)/*.svg)
SVG_DST := $(patsubst $(IMG)/%.svg, $(IMG_OUT)/%.svg, $(SVG_SRC))

# Copy all IMG/*.jpg files to IMG_OUT folder.
JPG_SRC := $(wildcard $(IMG)/*.jpg)
JPG_DST := $(patsubst $(IMG)/%.jpg, $(IMG_OUT)/%.jpg, $(JPG_SRC))

# We also have some PNGs
PNG_SRC := $(wildcard $(IMG)/*.png)
PNG_DST := $(patsubst $(IMG)/%.png, $(IMG_OUT)/%.png, $(PNG_SRC))

# Also copy anything inside the fonts folder (ttf and licenses)
FONTS_SRC := $(wildcard $(FONTS)/*)
FONTS_DST := $(patsubst $(FONTS)/%, $(FONTS_OUT)/%, $(FONTS_SRC))

.PHONY: defense
defense: dirs $(SVG_DST) $(JPG_DST) $(PNG_DST) $(FONTS_DST) $(TARGET)

$(TARGET): defense.js \
           defense-head.html \
           dzslides-footer.html
	node defense.js > $(OUT)/body.html
	cat defense-head.html $(OUT)/body.html dzslides-footer.html > $(TARGET)
	rm $(OUT)/body.html

.PHONY: clean
clean:
	rm --force $(TARGET) \
             $(IMG_OUT)/*.svg \
             $(IMG_OUT)/*.jpg \
             $(IMG_OUT)/*.png \
	rm --recursive --force $(FONTS_OUT)/*

# Extract individual SVG from SVG containing multiple diagrams with Inkscape.
$(IMG_OUT)/%.multi.svg: $(IMG)/%.multi.svg ../bin/svgsplit
	../bin/svgsplit svg $< $(IMG_OUT)
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

# and PNGs
$(IMG_OUT)/%.png: $(IMG)/%.png
	cp $< $@

# and files in the fonts folder
$(FONTS_OUT)/%: $(FONTS)/%
	cp --recursive $< $@

# Create build directories
.PHONY: dirs
dirs: $(OUT) $(IMG_OUT) $(FONTS_OUT)

$(OUT):
	mkdir --parents $(OUT)

$(IMG_OUT):
	mkdir --parents $(IMG_OUT)

$(FONTS_OUT):
	mkdir --parents $(FONTS_OUT)
