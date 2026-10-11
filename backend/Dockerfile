# =============================================================================
# MediStock Backend — Production Dockerfile (Java 21)
# Context: backend/
# =============================================================================

# Stage 1: Build the Spring Boot application using Java 21 & Maven
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source and build executable JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime container using Eclipse Temurin Java 21 JRE
FROM eclipse-temurin:21-jre
WORKDIR /app

# Security: run application as dedicated non-root user
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

# Copy production executable JAR
COPY --from=build /app/target/medistock-backend-*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
