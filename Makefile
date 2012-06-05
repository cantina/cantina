
REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER)

docs:
	./node_modules/.bin/yuidoc \
		--configfile ./yuidoc.json

.PHONY: test
.PHONY: docs
