o?=$(o)

mumbai:
	o=mumbai $(MAKE) deploy

deploy:
	npm run codegen:$(o)
	npm run build:$(o)
	npm run deploy:$(o)

.PNOHY: mumbai \
	deploy