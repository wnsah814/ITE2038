#drop database if exists ass2 ;
#create database ass2;
use ass2;

#select * from name_age;
select * from name_age1;
select * from name_salary1;
#explain analyze 
select * from name_age1 natural join name_salary1;
explain analyze select * from name_age1 natural join name_salary1;
explain select * from name_age1 natural join name_salary1;

# 2
select * from name_age2;
select * from name_age2 natural join name_salary2;

# 3
select * from name_grade1;
select * from name_grade2;
select * from name_number;

describe name_grade1;
select *
from name_grade2 R1
join name_grade1 R2
on R1.student_name = R2.student_name
;

select count(R1.student_name)
from name_grade1 R1
join name_grade2 R2
on
R1.student_name = R2.student_name and 
(
	(R1.math <= R2.math and R1.english <= R2.english and R1.science <= R2.science and R1.social <= R2.social and R1.history <= R2.history) or
	(R1.korean <= R2.korean and R1.english <= R2.english and R1.science <= R2.science and R1.social <= R2.social and R1.history <= R2.history) or
	(R1.korean <= R2.korean and R1.math <= R2.math and R1.science <= R2.science and R1.social <= R2.social and R1.history <= R2.history) or
	(R1.korean <= R2.korean and R1.math <= R2.math and R1.english <= R2.english and R1.social <= R2.social and R1.history <= R2.history) or
	(R1.korean <= R2.korean and R1.math <= R2.math and R1.english <= R2.english and R1.science <= R2.science and R1.history <= R2.history) or
	(R1.korean <= R2.korean and R1.math <= R2.math and R1.english <= R2.english and R1.science <= R2.science and R1.social <= R2.social)
);
#order by R1.student_name asc;

select 10000 - 1670;

select * from name_grade1 where student_name="igib";
select * from name_grade2 where student_name="igib";

select * from name_grade1 join name_grade2 on name_grade1.student_name = name_grade2.student_name where name_grade1.student_name="bcaa";


