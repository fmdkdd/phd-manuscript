defense.html: defense.js \
							defense-head.html \
              dzslides-footer.html
	node defense.js > body.html
	cat defense-head.html body.html dzslides-footer.html > defense.html

.PHONY: clean
clean:
	rm -f defense.html body.html
