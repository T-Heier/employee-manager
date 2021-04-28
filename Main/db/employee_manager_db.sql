DROP DATABASE IF EXISTS employee_manager_DB;
CREATE database employee_manager_DB;

USE employee_manager_DB

create table employee (
    id int AUTO_INCREMENT not null,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    primary key (id)
)

create table role (
    id int AUTO_INCREMENT not null,
    title varchar(30),
    salary decimal,
    primary key (id)
)

create table department (
    id int auto_increment not null,
    name varchar(30) not null,
    primary key (id)
)