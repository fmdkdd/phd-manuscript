TEXINPUTS='.:tex:' # Trailing ':' will make pdflatex include system paths
LATEXMK_ARGS=-pdflatex=xelatex -output-directory=pdf -pdf -synctex=1 -quiet

.PHONY: clean

pdf/manuscript.pdf: tex/manuscript.tex tex/preamble.tex refs.bib
	env TEXINPUTS=${TEXINPUTS} latexmk ${LATEXMK_ARGS} tex/manuscript.tex

tex/manuscript.tex: manuscript.org
	echo 'Exporting to LaTeX...'

# Export whole Org document to LaTeX, with the prelude.
	emacs --quick --batch \
        --load tex/export-setup.el \
        --file manuscript.org \
        --eval '(message (format "Org version %s" (org-version)))' \
        --eval '(org-latex-export-to-latex)'

	mv manuscript.tex tex/manuscript.tex

clean:
	latexmk -output-directory=pdf -C -f tex/manuscript.tex
	rm -f pdf/manuscript.synctex.gz pdf/manuscript.bbl pdf/manuscript.run.xml
	rm -f tex/manuscript.tex
