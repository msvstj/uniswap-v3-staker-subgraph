o?=$(o)

mumbai:
	o=mumbai $(MAKE) deploy

goerli:
	o=mainnet $(MAKE) deploy

deploy:
	npm run codegen:$(o)
	npm run build:$(o)
	npm run deploy:$(o)

.PNOHY: mumbai \
	goerli \
	deploy