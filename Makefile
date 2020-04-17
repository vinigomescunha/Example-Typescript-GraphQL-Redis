
all: install

test: ;@echo "Testing ....."; \
	export NODE_ENV=test; \
	cd node-test && npm install && npm test

install: ;@echo "Installing....."; \
    sudo fuser -k 5000/tcp; \
	mkdir -m 777 ./rsa; \
    . ./generate_rsa.sh; \
	mkdir -m 777 ./redis-data; \
    cd node-test && npm install; \
	cd .. && sudo docker-compose build --no-cache


