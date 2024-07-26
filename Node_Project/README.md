# Instructions for use

Add the following information into a .env with your student information.

```
ORACLE_USER=ora_YOUR-CWL-USERNAME
ORACLE_PASS=aYOUR-STUDENT-NUMBER
PORT=65535
ORACLE_HOST=dbhost.students.cs.ubc.ca
ORACLE_PORT=1522
ORACLE_DBNAME=stu
```

## Starting the service

Run the following command in the command line

```
sh ./remote-start.sh
```

## Stopping the service

Ctrl + C within the console will terminate the express server and close the connection pool.

## Accessing the webpage

The console will notify you which port the webpage is hosted on.
Default: 50001
[localhost:50001](http://localhost:50001/)
