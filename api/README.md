## Postgres setup

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
```

Install PgAdmin

https://www.pgadmin.org/download/

![](docs/pgAdmin4.png)

## Authz

Sample headers

```bash
{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJzbGVlMUBzZWVrLmNvbS5hdSIsInVzZXJuYW1lIjoic2hhbmUxIiwiaWF0IjoxNTQzODA5NjU2LCJleHAiOjE1NDM4MTE0NTZ9.hKV1vR6kV3hCCAMxBtGsuXeZ5MUq1TIwQSGcvk_gb_M"}
```

## Error handling

[Error handling](https://www.apollographql.com/docs/apollo-server/v2/features/errors.html)

**TODO**

To disable stacktraces for production, pass debug: false to the Apollo server constructor or set the NODE_ENV environment variable to ‘production’ or ‘test’. Note that this will make the stacktrace unavailable to your application. If you want to log the stacktrace, but not send it in the response to the client, see Masking and logging errors below.

## Resources

- [GraphQL execution](https://graphql.github.io/learn/execution/)
- [API validation/custom directives](https://blog.apollographql.com/graphql-validation-using-directives-4908fd5c1055) -- similar to jpa annotations!!
- [Rest datasource](https://www.apollographql.com/docs/apollo-server/v2/features/data-sources.html)
- [Github graphql API](https://developer.github.com/v4/)
- [Best practices](https://graphql.github.io/learn/best-practices/)
- [Sandbox](https://codesandbox.io/s/apollo-server)
- [Subscriptions middleware](https://www.apollographql.com/docs/apollo-server/v2/features/subscriptions.html#middleware)
