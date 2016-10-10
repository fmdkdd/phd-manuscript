defense.html: defense.md \
							data/templates/default.dzslides \
              data/dzslides/template.html
	pandoc -t dzslides -s $< -o $@ --data-dir=data/

.PHONY: clean
clean:
	rm -f defense.html
