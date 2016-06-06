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

  ;; Redefine `org-latex-src-block' with an advice to override the way BEGIN_SRC
  ;; blocks are exported.  I need listings wrapped in a figure environment for
  ;; captions in the margin to work.  And I need to use the caption and label
  ;; commands of the figure environment rather than passed to the listings package.
  ;; Changes are in done in Case 4, below.
  (require 'cl)                         ; for `case'
  (defun org-latex-src-block (src-block contents info)
    "Transcode a SRC-BLOCK element from Org to LaTeX.
CONTENTS holds the contents of the item.  INFO is a plist holding
contextual information."
    (when (org-string-nw-p (org-element-property :value src-block))
      (let* ((lang (org-element-property :language src-block))
             (caption (org-element-property :caption src-block))
             (caption-above-p (org-latex--caption-above-p src-block info))
             (label (org-element-property :name src-block))
             (custom-env (and lang
                              (cadr (assq (intern lang)
                                          org-latex-custom-lang-environments))))
             (num-start (case (org-element-property :number-lines src-block)
                          (continued (org-export-get-loc src-block info))
                          (new 0)))
             (retain-labels (org-element-property :retain-labels src-block))
             (attributes (org-export-read-attribute :attr_latex src-block))
             (float (plist-get attributes :float))
             (listings (plist-get info :latex-listings)))
        (cond
         ;; Case 1.  No source fontification.
         ((not listings)
          (let* ((caption-str (org-latex--caption/label-string src-block info))
                 (float-env
                  (cond ((string= "multicolumn" float)
                         (format "\\begin{figure*}[%s]\n%s%%s\n%s\\end{figure*}"
                                 (plist-get info :latex-default-figure-position)
                                 (if caption-above-p caption-str "")
                                 (if caption-above-p "" caption-str)))
                        (caption (concat
                                  (if caption-above-p caption-str "")
                                  "%s"
                                  (if caption-above-p "" (concat "\n" caption-str))))
                        (t "%s"))))
            (format
             float-env
             (concat (format "\\begin{verbatim}\n%s\\end{verbatim}"
                             (org-export-format-code-default src-block info))))))
         ;; Case 2.  Custom environment.
         (custom-env
          (let ((caption-str (org-latex--caption/label-string src-block info)))
            (format "\\begin{%s}\n%s\\end{%s}\n"
                    custom-env
                    (concat (and caption-above-p caption-str)
                            (org-export-format-code-default src-block info)
                            (and (not caption-above-p) caption-str))
                    custom-env)))
         ;; Case 3.  Use minted package.
         ((eq listings 'minted)
          (let* ((caption-str (org-latex--caption/label-string src-block info))
                 (float-env
                  (cond
                   ((string= "multicolumn" float)
                    (format "\\begin{listing*}\n%s%%s\n%s\\end{listing*}"
                            (if caption-above-p caption-str "")
                            (if caption-above-p "" caption-str)))
                   (caption
                    (concat (if caption-above-p caption-str "")
                            "%s"
                            (if caption-above-p "" (concat "\n" caption-str))))
                   (t "%s")))
                 (options (plist-get info :latex-minted-options))
                 (body
                  (format
                   "\\begin{minted}[%s]{%s}\n%s\\end{minted}"
                   ;; Options.
                   (concat
                    (org-latex--make-option-string
                     (if (or (not num-start) (assoc "linenos" options))
                         options
                       (append
                        `(("linenos")
                          ("firstnumber" ,(number-to-string (1+ num-start))))
                        options)))
                    (let ((local-options (plist-get attributes :options)))
                      (and local-options (concat "," local-options))))
                   ;; Language.
                   (or (cadr (assq (intern lang)
                                   (plist-get info :latex-minted-langs)))
                       (downcase lang))
                   ;; Source code.
                   (let* ((code-info (org-export-unravel-code src-block))
                          (max-width
                           (apply 'max
                                  (mapcar 'length
                                          (org-split-string (car code-info)
                                                            "\n")))))
                     (org-export-format-code
                      (car code-info)
                      (lambda (loc num ref)
                        (concat
                         loc
                         (when ref
                           ;; Ensure references are flushed to the right,
                           ;; separated with 6 spaces from the widest line
                           ;; of code.
                           (concat (make-string (+ (- max-width (length loc)) 6)
                                                ?\s)
                                   (format "(%s)" ref)))))
                      nil (and retain-labels (cdr code-info)))))))
            ;; Return value.
            (format float-env body)))
         ;; Case 4.  Use listings package.
         (t
          (let ((lst-lang
                 (or (cadr (assq (intern lang)
                                 (plist-get info :latex-listings-langs)))
                     lang))
                (caption-str
                 (when caption
                   (let ((main (org-export-get-caption src-block))
                         (secondary (org-export-get-caption src-block t)))
                     (if (not secondary)
                         (format "{%s}" (org-export-data main info))
                       (format "{[%s]%s}"
                               (org-export-data secondary info)
                               (org-export-data main info))))))
                (lst-opt (plist-get info :latex-listings-options)))
            (concat
             "\\SetListingFigureName\n"
             "\\begin{figure}\n"
             ;; Options.
             (format
              "\\lstset{%s}\n"
              (concat
               (org-latex--make-option-string
                (append
                 lst-opt
                 (cond
                  ((and (not float) (plist-member attributes :float)) nil)
                  ((string= "multicolumn" float) '(("float" "*")))
                  ((and float (not (assoc "float" lst-opt)))
                   `(("float" ,(plist-get info :latex-default-figure-position)))))
                 `(("language" ,lst-lang))
                 ;; (if label `(("label" ,label)) '(("label" " ")))
                 ;; (if caption-str `(("caption" ,caption-str)) '(("caption" " ")))
                 ;; `(("captionpos" ,(if caption-above-p "t" "b")))
                 (cond ((assoc "numbers" lst-opt) nil)
                       ((not num-start) '(("numbers" "none")))
                       ((zerop num-start) '(("numbers" "left")))
                       (t `(("firstnumber" ,(number-to-string (1+ num-start)))
                            ("numbers" "left"))))))
               (let ((local-options (plist-get attributes :options)))
                 (and local-options (concat "," local-options)))))
             ;; Source code.
             (format
              "\\begin{lstlisting}\n%s\\end{lstlisting}"
              (let* ((code-info (org-export-unravel-code src-block))
                     (max-width
                      (apply 'max
                             (mapcar 'length
                                     (org-split-string (car code-info) "\n")))))
                (org-export-format-code
                 (car code-info)
                 (lambda (loc num ref)
                   (concat
                    loc
                    (when ref
                      ;; Ensure references are flushed to the right,
                      ;; separated with 6 spaces from the widest line of
                      ;; code
                      (concat (make-string (+ (- max-width (length loc)) 6) ? )
                              (format "(%s)" ref)))))
                 nil (and retain-labels (cdr code-info)))))
             (if caption-str (format "\n\\caption{%s}" caption-str) "")
             (if label (format "\n\\label{%s}" label) "")
             "\n\\end{figure}"
             "\n\\UnsetListingFigureName")))))))

  ;; For \includegraphics[\linewidth] instead of the default 0.9\linewidth
  (setq org-latex-image-default-width "\\linewidth")

  ;; Redefine this ox-latex function just to add a `\protect' in front of
  ;; \includegraphics, so I can include images in figure captions.  A bit
  ;; heavy-handed, and I'm not entirely sure the `\protect' is benign, but it
  ;; works.  I also add a `margin' option to the `float' attribute passed by
  ;; ATTR_LATEX in Org, to trigger the `marginfigure' environment of
  ;; tufte-latex.
  ;; Also adds a `:no-center' option to disable figure centering.
  (defun org-latex--inline-image (link info)
    "Return LaTeX code for an inline image.
LINK is the link pointing to the inline image.  INFO is a plist
used as a communication channel."
    (let* ((parent (org-export-get-parent-element link))
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
                          ((or float
                               (org-element-property :caption parent)
                               (org-string-nw-p (plist-get attr :caption)))
                           (if (and (plist-member attr :float) (not float))
                               'nonfloat
                             'figure))
                          ((and (not float) (plist-member attr :float)) nil))))
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
              (format "\\protect\\includegraphics%s{%s}"
                      (cond ((not (org-string-nw-p options)) "")
                            ((= (aref options 0) ?,)
                             (format "[%s]"(substring options 1)))
                            (t (format "[%s]" options)))
                      path))
        (when (equal filetype "svg")
          (setq image-code (replace-regexp-in-string "^\\\\includegraphics"
                                                     "\\includesvg"
                                                     image-code
                                                     nil t))
          (setq image-code (replace-regexp-in-string "\\.svg}"
                                                     "}"
                                                     image-code
                                                     nil t))))
      ;; Return proper string, depending on FLOAT.
      (case float
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

  )

;; Allow Babel to execute source blocks in batch mode.
(with-eval-after-load 'ob-core
  (require 'ob-js)
  (require 'ob-dot)
  (setq org-confirm-babel-evaluate nil
        org-babel-use-quick-and-dirty-noweb-expansion t))
