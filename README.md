# Apollo Server

## PostgreSQL

1.  Start a postgress instance

        docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres

2.  Connect to it from an application

        docker run -it --rm --link apollo-postgres:postgres postgres psql -h postgres -U postgres
