
REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER)

docs:
	yuidoc .

.PHONY: test
.PHONY: docs
