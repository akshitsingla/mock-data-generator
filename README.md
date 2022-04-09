# mock-data-generator
A simple script to generate a mock dataset for our optimization class project (MIT-15.053)

## Run
### Using `docker`
```sh
docker run -it -v $PWD:/app -w /app node 'dummy-data-generator.js'
```
#### Quick `docker` commands
```sh
// Kill all running (docker) containers
docker kill $(docker ps -q)
```
