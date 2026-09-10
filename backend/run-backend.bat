@echo off
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot"
set "PATH=%JAVA_HOME%\bin;%~dp0tools\apache-maven-3.9.9\bin;%PATH%"
"%~dp0mvnw.cmd" spring-boot:run -Dspring-boot.run.profiles=dev
