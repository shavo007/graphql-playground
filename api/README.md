# Apollo server playground

![](https://graphql.org/img/og_image.png)

> A full-fledged Apollo Server 2 with Apollo Client 2 starter project with Express and PostgreSQL.

## Graphql you say..

> Fetch all data in a single roundtrip, and provide structured documentation for our APIs

## Features

- Node.js with Express and Apollo Server 2
  - cursor-based Pagination
- PostgreSQL Database with Sequelize
  - entities: users, messages
- Rest api resolver for Ticketmaster using new datasource API
- Authentication
  - powered by JWT and local storage
  - Sign Up, Sign In, Sign Out
- Authorization
  - protected endpoint (e.g. verify valid session)
  - protected resolvers (e.g. e.g. session-based, role-based)
  - protected routes (e.g. session-based, role-based)
- performance optimizations
  - example of using Facebook's dataloader
- E2E testing

### Postgres setup

`docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres`

PSQL commands

```bash
docker exec -it some-postgres bash
psql -d postgres -U postgres
\l #list databases
\dt #list tables
\dn #list schemas
\s #command history

SELECT * from users;
SELECT text from messages;
CREATE DATABASE mytestdatabase; #create test database 
```

Install PgAdmin

https://www.pgadmin.org/download/

![](docs/pgAdmin4.png)

### Setup

```bash
nvm use \
&& yarn \
&& cp .env.example .env \
&& yarn start
```

### Running queries locally

You’ll need to get one API key:

- [Ticketmaster API key](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/)
- copy api key to .env file

## Authz

Sample headers

```bash
{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJzbGVlMUBzZWVrLmNvbS5hdSIsInVzZXJuYW1lIjoic2hhbmUxIiwiaWF0IjoxNTQzODA5NjU2LCJleHAiOjE1NDM4MTE0NTZ9.hKV1vR6kV3hCCAMxBtGsuXeZ5MUq1TIwQSGcvk_gb_M"}
```

## Error handling

[Error handling](https://www.apollographql.com/docs/apollo-server/v2/features/errors.html)

**TODO**

To disable stacktraces for production, pass debug: false to the Apollo server constructor or set the NODE_ENV environment variable to ‘production’ or ‘test’. Note that this will make the stacktrace unavailable to your application. If you want to log the stacktrace, but not send it in the response to the client, see Masking and logging errors below.

## Deployment options

### Docker

replace value below for TM_API_KEY

```bash
DOCKER_BUILDKIT=1 docker build   -t shanelee007/graphql:1.0.0 -t  shanelee007/graphql:latest .
docker run -d -e TM_API_KEY=REDACTED -p 8000:8000 --link some-postgres  shanelee007/graphql:1.1.0
```

### Skaffold

> Easy and Repeatable Kubernetes Development

```bash
brew install skaffold
skaffold init #initialise the project with yaml config
skaffold config set --global local-cluster true #do not push images after building
skaffold dev -v=info #run locally/watching changes production mode

```

#### Release upgrade

```bash
brew upgrade skaffold
skaffold fix --overwrite
```

#### Run locally

There is a new feature for local dev to sync files, instead of rebuilding the whole artifact's image

[profiles](https://skaffold.dev/docs/how-tos/profiles/) allows you to define build and deployment configurations for different contexts

To run in dev mode with sync run the following profile

`skaffold dev -p dev -v=info #run locally/watching changes dev mode`

If you like, you can try the experimental gui mode

`skaffold dev -p dev -v=info --experimental-gui`

[![asciicast](https://asciinema.org/a/220028.svg)](https://asciinema.org/a/220028)

### Kubernetes

replace secret for TM_API_KEY

`echo -n 'XXX' | base64`

replace value for key `TM_API_KEY` inside kubernetes/secret.yaml

**NOTE** both containers (graphql-api and postgres) are running inside the same pod.
To productionise you would extract out the database and run [AWS aurora](https://aws.amazon.com/rds/aurora/details/postgresql-details/) for example

Kubernetes 1.13 now supports [server dry run](https://kubernetes.io/blog/2019/01/14/apiserver-dry-run-and-kubectl-diff/)

```bash
kubectl create ns graphql

#need to have kubectl 1.13 installed or higher
kubectl apply -f kubernetes/ --server-dry-run

kubectl apply -f kubernetes/ -n graphql --record #this will create the deployment, service and the config on the cluster

kubectl exec -it <pod_name> -c graphql-api -n graphql  sh #inspect the container
kubectl logs -f <pod_name> -c graphql-api -n graphql #inspect the logs

kubectl exec -it <pod_name> -c postgres -n graphql bash #inspect the database
psql -d postgres -U postgres
\l #list databases
```

get the service to discover the public port exposed to access the api

```bash
$ kgsvcowide
NAME                                        TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE       SELECTOR
graphql-api                                 NodePort       10.98.127.193    <none>        8000:30537/TCP   40m       app=graphql
```

Now using playground, you can for example access the endpoint over `http://localhost:30537/graphql`

#### Linkerd

> Linkerd is a service mesh for Kubernetes and other frameworks. It makes running services easier and safer by giving you runtime debugging, observability, reliability, and security—all without requiring any changes to your code.

##### Install

```bash
curl -sL https://run.linkerd.io/install | sh
export PATH=$PATH:$HOME/.linkerd2/bin
linkerd version
linkerd install | kubectl apply -f - #install to cluster
linkerd check #check its running
linkerd dashboard #explore control plane
```

Inject side car container to graphql deployment

```bash
kubectl get -n graphql deploy -o yaml \
 | linkerd inject - \
 | kubectl apply -f -

linkerd -n graphql check --proxy
linkerd -n graphql stat deploy
```

`tap` shows the stream of requests across the deployment

![](docs/Linkerdtap.png)

Linkerd includes Grafana to visualize all the great metrics collected by Prometheus and ships with some extremely valuable dashboards.

![](docs/GrafanaLinkerdDeployment.png)

## TODO

- add in circleci
- pact for graphql https://github.com/pact-foundation/pact-js/tree/feat/message-pact/examples/graphql
- skaffold sync feature -- need a new build and context if you want to run in dev mode compared to prod mode
- https://skaffold.dev/docs/how-tos/profiles/ && https://github.com/GoogleContainerTools/skaffold/blob/master/examples/nodejs/skaffold.yaml

## Challenges

- How to keep graphql schema in sync with the downstream resource APIs (If you have multiple sources of truth in a microservice architecture, it’s a matter of when, not if they’ll become out of sync.)
- Timeout limit to handle extremely complex queries that could bog down their servers
- Schema validation (https://blog.apollographql.com/schema-validation-with-apollo-engine-4032456425ba)

## Resources

- [GraphQL execution](https://graphql.github.io/learn/execution/)
- [API validation/custom directives](https://blog.apollographql.com/graphql-validation-using-directives-4908fd5c1055) -- similar to jpa annotations!!
- [Rest datasource](https://www.apollographql.com/docs/apollo-server/v2/features/data-sources.html)
- [Github graphql API](https://developer.github.com/v4/)
- [Best practices](https://graphql.github.io/learn/best-practices/)
- [Sandbox](https://codesandbox.io/s/apollo-server)
- [Subscriptions middleware](https://www.apollographql.com/docs/apollo-server/v2/features/subscriptions.html#middleware)
- [Mocking](https://www.apollographql.com/docs/apollo-server/v2/features/mocking.html)
- [Skaffold](https://ahmet.im/blog/skaffold/)
- [Companies using graphql](https://stackshare.io/posts/companies-using-graphql-in-production-2018)
- [Building evolvable schema](https://blog.apollographql.com/graphql-schema-design-building-evolvable-schemas-1501f3c59ed5)
