;; Use org version from .emacs.d/elpa directory for latest goodness and
;; consistency with manual export from Emacs.
(package-initialize)

;; How to export 'cite' links
(defun fmdkdd/org-export-cite (path desc format)
  (when (eq format 'latex)
    (format "\\\cite{%s}" path)))

(with-eval-after-load 'org
  (org-add-link-type "cite" nil #'fmdkdd/org-export-cite))

(with-eval-after-load 'ox
  (setq org-export-with-todo-keywords nil))

(with-eval-after-load 'ox-latex
  ;; Use CUSTOM_ID and NAME labels of Org file as labels for \label commands in
  ;; the exported LaTeX.  Needed to refer to source bloks with a NAME.
  (setq org-latex-prefer-user-labels t)

  ;; Custom LATEX_CLASS that sets the documentclass, removes all default
  ;; packages, and tells Org how to translate headlines into LaTeX sections.
  (add-to-list 'org-latex-classes
               '("thesis"
                 "[NO-DEFAULT-PACKAGES]\n\\input{preamble}"
                 ("\\chapter{%s}" . "\\chapter*{%s}")
                 ("\\section{%s}" . "\\section*{%s}")
                 ("\\subsection{%s}" . "\\subsection*{%s}")
                 ("\\subsubsection{%s}" . "\\subsubsection*{%s}")))

  ;; Use as default class
  (setq org-latex-default-class "thesis")

  ;; Do not insert maketitle, we do that in main.tex
  (setq org-latex-title-command "")

  ;; Use the listings package for exporting source blocks.
  (setq org-latex-listings t)

  (setq org-latex-text-markup-alist
        '((bold . "\\textbf{%s}")
          (code . "\\lstinline|%s|")
          (italic . "\\emph{%s}")
          (strike-through . "\\sout{%s}")
          (underline . "\\uline{%s}")
          (verbatim . protectedtexttt)))

  ;; For \includegraphics[\linewidth] instead of the default 0.9\linewidth
  (setq org-latex-image-default-width "\\linewidth")

  ;; Need to find the parent special block to avoid wrapping inline images in a
  ;; figure block.
  (defun fmdkdd/org-find-special-block (elem)
    (cond
     ((null elem) nil)
     ((eq 'special-block (org-element-type elem)) elem)
     (t (fmdkdd/org-find-special-block (org-export-get-parent-element elem)))))

  ;; Add a "slightly" float parameter to add a sliver of space above an
  ;; `includegraphics', without warping it in a figure.  Also deals with inline
  ;; images in `aside' or `side-figure' blocks.
  (require 'cl)                         ; for `case'
  (defun org-latex--inline-image (link info)
    "Return LaTeX code for an inline image.
LINK is the link pointing to the inline image.  INFO is a plist
used as a communication channel."
    (let* ((parent (org-export-get-parent-element link))
           (block (fmdkdd/org-find-special-block link))
           (block-type (org-element-property :type block))
           (path (let ((raw-path (org-element-property :path link)))
                   (if (not (file-name-absolute-p raw-path)) raw-path
                     (expand-file-name raw-path))))
           (filetype (file-name-extension path))
           (caption (org-latex--caption/label-string parent info))
           (caption-above-p (org-latex--caption-above-p link info))
           ;; Retrieve latex attributes from the element around.
           (attr (org-export-read-attribute :attr_latex parent))
           (float (let ((float (plist-get attr :float)))
                    (cond ((string= float "wrap") 'wrap)
                          ((string= float "sideways") 'sideways)
                          ((string= float "multicolumn") 'multicolumn)
                          ((string= float "margin") 'margin)
                          ((string= float "slightly") 'slightly)
                          ((or float
                               (org-element-property :caption parent)
                               (org-string-nw-p (plist-get attr :caption)))
                           (if (and (plist-member attr :float) (not float))
                               'nonfloat
                             'figure))
                          ((and (not float) (plist-member attr :float)) nil))))
           (in-aside (or (string= "side-figure" block-type)
                         (string= "aside" block-type)))
           (full-figure (string= "full-figure" block-type))
           (placement
            (let ((place (plist-get attr :placement)))
              (cond
               (place (format "%s" place))
               ((eq float 'wrap) "{l}{0.5\\textwidth}")
               ((eq float 'figure)
                (format "[%s]" (plist-get info :latex-default-figure-position)))
               (t ""))))
           (comment-include (if (plist-get attr :comment-include) "%" ""))
           (center (if (plist-get attr :no-center) "" "\\centering\n"))
           ;; It is possible to specify width and height in the
           ;; ATTR_LATEX line, and also via default variables.
           (width (cond ((plist-get attr :width))
                        ((plist-get attr :height) "")
                        (in-aside "\\maxwidth{\\marginparwidth}")
                        (full-figure "\\fullwidth")
                        ((eq float 'wrap) "0.48\\textwidth")
                        (t (plist-get info :latex-image-default-width))))
           (height (cond ((plist-get attr :height))
                         ((or (plist-get attr :width)
                              (memq float '(figure wrap))) "")
                         (t (plist-get info :latex-image-default-height))))
           (options (let ((opt (or (plist-get attr :options)
                                   (plist-get info :latex-image-default-option))))
                      (if (not (string-match "\\`\\[\\(.*\\)\\]\\'" opt)) opt
                        (match-string 1 opt))))
           image-code)
      (if (member filetype '("tikz" "pgf"))
          ;; For tikz images:
          ;; - use \input to read in image file.
          ;; - if options are present, wrap in a tikzpicture environment.
          ;; - if width or height are present, use \resizebox to change
          ;;   the image size.
          (progn
            (setq image-code (format "\\input{%s}" path))
            (when (org-string-nw-p options)
              (setq image-code
                    (format "\\begin{tikzpicture}[%s]\n%s\n\\end{tikzpicture}"
                            options
                            image-code)))
            (when (or (org-string-nw-p width) (org-string-nw-p height))
              (setq image-code (format "\\resizebox{%s}{%s}{%s}"
                                       (if (org-string-nw-p width) width "!")
                                       (if (org-string-nw-p height) height "!")
                                       image-code))))
        ;; For other images:
        ;; - add width and height to options.
        ;; - include the image with \includegraphics.
        (when (org-string-nw-p width)
          (setq options (concat options ",width=" width)))
        (when (org-string-nw-p height)
          (setq options (concat options ",height=" height)))
        (let ((search-option (org-element-property :search-option link)))
          (when (and search-option
                     (equal filetype "pdf")
                     (org-string-match-p "\\`[0-9]+\\'" search-option)
                     (not (org-string-match-p "page=" options)))
            (setq options (concat options ",page=" search-option))))
        (setq image-code
              (format "\\includegraphics%s{%s}"
                      (cond ((not (org-string-nw-p options)) "")
                            ((= (aref options 0) ?,)
                             (format "[%s]"(substring options 1)))
                            (t (format "[%s]" options)))
                      path))
        (when (equal filetype "svg")
          ;; No we don't want `includesvg'.  We'll do the conversion ourselves
          ;; thankyouverymuch.
          ;; (setq image-code (replace-regexp-in-string "^\\\\includegraphics"
          ;;                                            "\\includesvg"
          ;;                                            image-code
          ;;                                            nil t))
          (setq image-code (replace-regexp-in-string "\\.svg}"
                                                     "}"
                                                     image-code
                                                     nil t))))
      (when full-figure
        (setq image-code
         (format "\\noindent\n%s" image-code)))
      ;; This was intended to avoid wrapping an `includegraphics' in any
      ;; environment for an inline image inside a `side-figure' block.  But
      ;; this is actually the default as long as we don't use set caption using
      ;; #+CAPTION in org.
      ;; (if (string= "side-figure" block-type)
      ;;   (format "%s\n%s" image-code caption)
      ;; Return proper string, depending on FLOAT.
      (case float
        ;; Raw `includegraphics', but with space above
        (slightly (format "\\vspace{6pt}\\noindent\n%s\n%s"
                          image-code caption))
        (wrap (format "\\begin{wrapfigure}%s
%s%s%s%s
%s\\end{wrapfigure}"
                      placement
                      (if caption-above-p caption "")
                      center
                      comment-include image-code
                      (if caption-above-p "" caption)))
        (sideways (format "\\begin{sidewaysfigure}
%s%s%s%s
%s\\end{sidewaysfigure}"
                          (if caption-above-p caption "")
                          center
                          comment-include image-code
                          (if caption-above-p "" caption)))
        (multicolumn (format "\\begin{figure*}%s
%s%s%s%s
%s\\end{figure*}"
                             placement
                             (if caption-above-p caption "")
                             center
                             comment-include image-code
                             (if caption-above-p "" caption)))
        (figure (format "\\begin{figure}%s
%s%s%s%s
%s\\end{figure}"
                        placement
                        (if caption-above-p caption "")
                        center
                        comment-include image-code
                        (if caption-above-p "" caption)))
        (margin (format "\\begin{marginfigure}%s
%s%s%s%s
%s\\end{marginfigure}"
                        placement
                        (if caption-above-p caption "")
                        center
                        comment-include image-code
                        (if caption-above-p "" caption)))
        (nonfloat
         (format "\\begin{center}
%s%s
%s\\end{center}"
                 (if caption-above-p caption "")
                 image-code
                 (if caption-above-p "" caption)))
        (otherwise image-code))))


  ;; Examples are exported to a dumb listing, to get a consistent look.
  (defun org-latex-example-block (example-block contents info)
    "Transcode an EXAMPLE-BLOCK element from Org to LaTeX.
CONTENTS is nil.  INFO is a plist holding contextual
information."
    (when (org-string-nw-p (org-element-property :value example-block))
      (org-latex--wrap-label
       example-block
       (format "\\lstset{language=none,label= ,caption= ,numbers=none}
\\begin{lstlisting}\n%s\\end{lstlisting}"
               (org-export-format-code-default example-block info))
       info)))

  ;; Small examples (lines beginning with `:') are exported to a dumb listing,
  ;; to get a consistent look.
  (defun org-latex-fixed-width (fixed-width contents info)
    "Transcode a FIXED-WIDTH element from Org to LaTeX.
CONTENTS is nil.  INFO is a plist holding contextual information."
    (org-latex--wrap-label
     fixed-width
     (format "\\lstset{language=none,label= ,caption= ,numbers=none}
\\begin{lstlisting}\n%s\\end{lstlisting}"
             (org-remove-indentation
              (org-element-property :value fixed-width)))
     info))
  )

;; Allow Babel to execute source blocks in batch mode.
(with-eval-after-load 'ob-core
  (require 'ob-js)
  (require 'ob-dot)
  (setq org-confirm-babel-evaluate nil
        org-babel-use-quick-and-dirty-noweb-expansion t))
