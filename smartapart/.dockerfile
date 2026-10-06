# Estágio de Build (Compilação)
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Baixa as dependências primeiro (aproveita o cache do Docker)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia o código e gera o jar
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio de Execução
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/smartapart-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]