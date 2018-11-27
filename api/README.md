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

## Resources

[GraphQL execution](https://graphql.github.io/learn/execution/)
