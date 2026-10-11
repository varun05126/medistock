package com.medistock.config;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String url = properties.getUrl();
        if (url != null) {
            String trimmedUrl = url.trim();
            // Automatically normalize postgresql:// or postgres:// URI to jdbc:postgresql://
            if (trimmedUrl.startsWith("postgres://")) {
                properties.setUrl("jdbc:postgresql://" + trimmedUrl.substring("postgres://".length()));
            } else if (trimmedUrl.startsWith("postgresql://")) {
                properties.setUrl("jdbc:postgresql://" + trimmedUrl.substring("postgresql://".length()));
            }
        }
        return properties.initializeDataSourceBuilder().build();
    }
}
