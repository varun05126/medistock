package com.medistock.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;

import static org.junit.jupiter.api.Assertions.*;

class DatabaseConfigTest {

    private final DatabaseConfig databaseConfig = new DatabaseConfig();

    @Test
    @DisplayName("Clean JDBC URL without user info is preserved")
    void testCleanJdbcUrlPreserved() {
        DataSourceProperties properties = new DataSourceProperties();
        properties.setUrl("jdbc:postgresql://ep-small-bar-b5l7j51e-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require");
        properties.setUsername("authenticator");
        properties.setPassword("secret");

        databaseConfig.dataSource(properties);

        assertEquals("jdbc:postgresql://ep-small-bar-b5l7j51e-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require", properties.getUrl());
        assertEquals("authenticator", properties.getUsername());
        assertEquals("secret", properties.getPassword());
    }

    @Test
    @DisplayName("PostgreSQL URI with embedded user:password is parsed into separate properties and clean JDBC URL")
    void testPostgresUriWithCredentialsParsed() {
        DataSourceProperties properties = new DataSourceProperties();
        properties.setUrl("postgresql://myuser:mypassword@ep-host.neon.tech/neondb?sslmode=require");

        databaseConfig.dataSource(properties);

        assertEquals("jdbc:postgresql://ep-host.neon.tech/neondb?sslmode=require", properties.getUrl());
        assertEquals("myuser", properties.getUsername());
        assertEquals("mypassword", properties.getPassword());
    }

    @Test
    @DisplayName("Malformed jdbc:postgresql with embedded credentials strips user info to satisfy PostgreSQL JDBC driver")
    void testMalformedJdbcWithCredentialsSanitized() {
        DataSourceProperties properties = new DataSourceProperties();
        properties.setUrl("jdbc:postgresql://authenticator:npg_secret@ep-host.neon.tech:5432/neondb?sslmode=require");

        databaseConfig.dataSource(properties);

        assertEquals("jdbc:postgresql://ep-host.neon.tech:5432/neondb?sslmode=require", properties.getUrl());
        assertEquals("authenticator", properties.getUsername());
        assertEquals("npg_secret", properties.getPassword());
    }
}
