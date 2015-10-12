;; Use org version from .emacs.d/elpa directory for latest goodness and
;; consistency with manual export from Emacs.
(package-initialize)

;; How to export 'cite' links
(defun fmdkdd/org-export-cite (path desc format)
  (when (eq format 'latex)
    (format "\\\cite{%s}" path)))

(with-eval-after-load 'org
  (org-add-link-type "cite" nil #'fmdkdd/org-export-cite))


(with-eval-after-load 'ox-latex
  (add-to-list 'org-latex-classes
               '("thesis" "\\documentclass{book}\n\
                           [NO-DEFAULT-PACKAGES]\n\
\\input{preamble}"
                 ("\\part{%s}" . "\\part*{%s}")
                 ("\\chapter{%s}" . "\\chapter*{%s}")
                 ("\\section{%s}" . "\\section*{%s}")
                 ("\\subsection{%s}" . "\\subsection*{%s}")
                 ("\\subsubsection{%s}" . "\\subsubsection*{%s}"))))

;; (setq org-latex-prefer-user-labels t)
