TEXINPUTS='.:tex:' # Trailing ':' will make pdflatex include system paths
LATEXMK_ARGS=-pdflatex=xelatex -output-directory=pdf -pdf -synctex=1 -quiet

.PHONY: clean go

pdf/manuscript.pdf: tex/manuscript.tex tex/preamble.tex refs.bib
	env TEXINPUTS=${TEXINPUTS} latexmk ${LATEXMK_ARGS} tex/manuscript.tex

# Only useful for debugging the TeX output with Synctex, since it does not
# re-export the TeX from changes in the Org document.
go:
	env TEXINPUTS=${TEXINPUTS} latexmk ${LATEXMK_ARGS} -pvc tex/manuscript.tex

tex/manuscript.tex: manuscript.org tex/export-setup.el
	echo 'Exporting to LaTeX...'

	# Export whole Org document to LaTeX, with the prelude.
	emacs --quick --batch \
        --load tex/export-setup.el \
        --file manuscript.org \
        --eval '(message (format "Org version %s" (org-version)))' \
        --eval '(org-latex-export-to-latex)'

  # Org creates the TeX in the same directory as the Org document.
  # Maybe there is a way to override it with ELisp, but for now...
	mv manuscript.tex tex/manuscript.tex

clean:
	latexmk -output-directory=pdf -C -f tex/manuscript.tex
	rm --force pdf/manuscript.synctex.gz pdf/manuscript.bbl pdf/manuscript.run.xml
	rm --force tex/manuscript.tex
