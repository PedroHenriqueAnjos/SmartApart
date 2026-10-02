@echo off
cd smartapart
cd /d %~dp0
mvnw spring-boot:run 


@echo off
cd SmartApart 
cd frontend 
cd /d %~dp0
npm start
pause