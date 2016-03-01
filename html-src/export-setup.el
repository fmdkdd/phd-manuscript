;; Use org version from .emacs.d/elpa directory for latest goodness and
;; consistency with manual export from Emacs.
(package-initialize)

(with-eval-after-load 'org
  ;; Tell Org how to export 'cite' links
  (defun fmdkdd/org-export-cite (path desc format)
    (when (eq format 'html)
      (format "<a href=\"#%s\">%s</a>" path path)))

  (org-add-link-type "cite" nil #'fmdkdd/org-export-cite))

(with-eval-after-load 'ox-html
  ;; Produce figcaption elements, the only way to identify caption in the CSS.
  (setq org-html-html5-fancy t)

  ;; No validation link in postamble
  (setq org-html-postamble t
        org-html-postamble-format
        '(("fr"
           "<p class=\"author\">Auteur: %a</p>\n<p class=\"created\">Crée: %T (%c)</p>")))

  ;; Do not embed SVG image in <object> tag.  An <img> works better.
  (defun fmdkdd/org-html--format-image (_ source attributes info)
    "Return \"img\" tag with given SOURCE and ATTRIBUTES.
SOURCE is a string specifying the location of the image.
ATTRIBUTES is a plist, as returned by
`org-export-read-attribute'.  INFO is a plist used as
a communication channel."
    (org-html-close-tag
     "img"
     (org-html--make-attribute-string
      (org-combine-plists
       (list :src source
             :alt (if (string-match-p "^ltxpng/" source)
                      (org-html-encode-plain-text
                       (org-find-text-property-in-string 'org-latex-src source))
                    (file-name-nondirectory source)))
       attributes))
     info))

  (advice-add 'org-html--format-image :around #'fmdkdd/org-html--format-image))

;; Allow Babel to execute source blocks in batch mode.
(with-eval-after-load 'ob-core
  (require 'ob-js)
  (require 'ob-dot)
  (setq org-confirm-babel-evaluate nil
        org-babel-use-quick-and-dirty-noweb-expansion t))
