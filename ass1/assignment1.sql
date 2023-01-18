#1
select name from pokemon where type="grass" order by name asc;
#2
select name from trainer where hometown="Brown City" or hometown="Rainbow City" order by name asc;
#3
select distinct type from pokemon order by type asc;
#4
select name from city where name like "B%" order by name asc;
#5
select hometown from trainer where name not like "M%" order by hometown asc;
#6
select nickname from catchedpokemon where level=(select max(level) from catchedpokemon) order by nickname asc;
#7
select name from pokemon where name regexp "^[AEIOU]" order by name asc;
-- select name from pokemon where left(name, 1) in ('A', 'E', 'I', 'O', 'U') order by name asc;
#8
select avg(level) as "Average Level" from catchedpokemon;
#9
select MAX(level) from catchedpokemon where owner_id = (select id from trainer where name="Yellow");
#10
select distinct hometown from trainer order by hometown asc;
#11
select T.name, C.nickname
from trainer as T
join catchedpokemon as C
on T.id=C.owner_id
and C.nickname like "A%"
order by T.name asc;

#12
select name 
from trainer 
where id = (
	select leader_id 
    from gym 
    where city=(
		select name 
        from city 
        where description="Amazon"
	)
);

#13
-- insert into catchedpokemon (id, owner_id, pid, level, nickname) values (999, 3, 4, 1, "4fire");
-- insert into catchedpokemon (id, owner_id, pid, level, nickname) values (998, 3, 5, 1, "5fire");
-- insert into catchedpokemon (id, owner_id, pid, level, nickname) values (997, 3, 6, 1, "6fire");
-- delete from catchedpokemon where id=999;
-- delete from catchedpokemon where id=998;
-- delete from catchedpokemon where id=997;
-- select * from catchedpokemon;
-- for testing someone has more fire type pokemon than a trainer 2 
create view firemax as (
	select owner_id as id, count(*) as countFire
	from catchedpokemon
		where pid in (
		select id from pokemon where type="Fire"
	)
	group by owner_id
);

select id, countFire
from firemax
where countFire = (
	select max(countFire)
    from firemax
);

#14
select distinct type from pokemon where id like "_" order by id desc;
#15
select count(id) as count from pokemon where not type="Fire";
#16
select name from pokemon where id in (select before_id from evolution where before_id > after_id);
#17
select avg(level) as avgLevel from catchedpokemon where pid in (select id from pokemon where type="Water");
#18
select nickname from catchedpokemon where level = (
	select max(level)
    from catchedpokemon 
    where owner_id in (select leader_id from gym)
);
#19
create view avglevel as (
select owner_id, avg(level) as avgLevel
from catchedpokemon 
where owner_id in (
	select id 
    from trainer 
    where hometown="Blue City")
group by owner_id
);

select T.name
from avglevel as A
join trainer as T
on A.owner_id=T.id
where avgLevel=(
	select max(avgLevel)
    from avglevel
);

#20
select P.name 
from (
	select pid
	from catchedpokemon
	where pid in (
		select before_id
		from evolution
	) 
	and pid in (
		select id from pokemon where type="Electric"
	)
	and owner_id in (
		select id
		from trainer
		group by hometown
		having count(*) = 1
	)
) as A
join pokemon as P
on A.pid = P.id;

#21
select name, sumLevel
from trainer natural join (
	select owner_id as id, sum(level) as sumLevel
	from catchedpokemon 
	where owner_id in (select leader_id from gym) 
    group by owner_id
) as D
order by sumLevel desc;

#22
select hometown 
from trainer 
group by hometown 
having count(hometown) = (
	select max(cnt) 
    from (
		select count(hometown) as cnt 
        from trainer 
        group by hometown
	) as D
);

#23
select name
from (
	select distinct pid 
	from catchedpokemon
	where owner_id in (select id from trainer where hometown="Sangnok City")
) as A 
join (
	select pid 
	from catchedpokemon
	where owner_id in (select id from trainer where hometown="Brown City")
) as B
on A.pid=B.pid
join pokemon as P
on A.pid=P.id
order by P.name asc;

#24
select T.name
from catchedpokemon as C
join trainer as T
on C.owner_id = T.id
where C.pid in (
	select id from pokemon where name like "P%"
)
and T.hometown="Sangnok City"
order by T.name asc;

#25
select T.name as TrainerName, P.name as PokemonName 
from (
	select owner_id, pid 
    from catchedpokemon
    ) as D 
join trainer as T
on D.owner_id = T.id 
join pokemon as P
on D.pid = P.id
order by TrainerName asc, PokemonName asc;

#26 1->2만 가능한 애들
select name from pokemon where id in (
	select before_id
	from evolution
	where after_id not in (select before_id from evolution) #1->3 제거
	and before_id not in (select after_id from evolution) #2->3 제거
)
order by name asc;

#27
select C.nickname
from pokemon as P
join catchedpokemon as C
on P.id=C.pid
and C.owner_id = (select leader_id from gym where city="Sangnok City")
and P.type="Water"
order by C.nickname asc;

#28
select T.name
from catchedpokemon as C
join trainer as T
on C.owner_id=T.id
and C.pid in (
	select after_id
	from evolution
)
group by C.owner_id
having count(*) >= 3
order by T.name asc;

#29
select P.name
from pokemon as P
where P.id not in (
	select pid
	from catchedpokemon
)
order by P.name asc;

#30
select max(level) as maxLevel
from trainer as T
join catchedpokemon as C
on T.id = C.owner_id
group by T.hometown
order by maxLevel desc;

#31
select *
from evolution as E1
join evolution as E2
on E1.after_id = E2.before_id
join pokemon as P1
on E1.before_id=P1.id
join pokemon as P2
on E2.before_id=P2.id
join pokemon as P3
on E2.after_id=P3.id
order by P1.id asc;