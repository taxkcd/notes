---
title: Postgres Cheatsheet
date: 2025-11-14
---

## Postgre

### i. Basics

``` bash
docker run --name pgname -d -e POSTGRES_PASSWORD=postgres postgres
# bash into it 
docker exec -it pgname bash      
# start the db 
psql -U postgres

```
``` sql
create table grades_org(id serial not null, g int not null );
  
insert into grades_org(g) select floor(random()*100) from generate_series(0, 10000000);

explain analyze select count(*) from grades_org where g = 30;
  
create table grades_parts (id serial not null, g int not null) partition by range(g);

create table g3560 (like grades_parts including indexes);
  
alter table grades_parts attach partition g3560 for values from (35) to (60);

alter table grades_parts attach partition g80100 for values from (80) to (100);
  
insert into grades_parts select * from grades_org;

select max(g) from g3560;

select count(*) from g3560;

create index grades_parts_idx on grades_parts(g);
create index grades_parts_idx on g0035(g);
\d g0035

SELECT pg_relation_size(oid), relname 
FROM pg_class 
ORDER BY pg_relation_size(oid) DESC;

show ENABLE_PARTITION_PRUNING;

set enable_partition_pruning = off;
set enable_partition_pruning = on;
explain select count(*) from grades_parts where g = 30;

```
### ii. SHARDING

``` bash
docker build -t pgshard . # create an image

docker run --name pgshard3 -p 5434:5432 -e POSTGRES_PASSWORD=postgres note # create shards llike this 1, 2, 3

docker run --name pgadmin4 -p 5430:80 \           
           -e "PGADMIN_DEFAULT_EMAIL=admin@example.com" \
           -e "PGADMIN_DEFAULT_PASSWORD=secret" \
           -d dpage/pgadmin4                            # this is pgadmin. use this to manage your shards
```