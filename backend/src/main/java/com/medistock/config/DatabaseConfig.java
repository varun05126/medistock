package com.medistock.config;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String url = properties.getUrl();
        if (url != null && !url.trim().isEmpty()) {
            String trimmedUrl = url.trim();

            // Strip leading "jdbc:" if present for URI parsing
            String rawUri = trimmedUrl.startsWith("jdbc:") ? trimmedUrl.substring(5) : trimmedUrl;

            if (rawUri.startsWith("postgres://") || rawUri.startsWith("postgresql://")) {
                try {
                    // Standardize scheme to http for java.net.URI parsing
                    String uriString = rawUri.replaceFirst("^postgres(ql)?://", "http://");
                    URI uri = new URI(uriString);

                    String userInfo = uri.getUserInfo();
                    if (userInfo != null && !userInfo.isEmpty()) {
                        String[] parts = userInfo.split(":", 2);
                        if (parts.length > 0 && (properties.getUsername() == null || properties.getUsername().isEmpty() || properties.getUsername().equals("root"))) {
                            properties.setUsername(parts[0]);
                        }
                        if (parts.length > 1 && (properties.getPassword() == null || properties.getPassword().isEmpty())) {
                            properties.setPassword(parts[1]);
                        }
                    }

                    String host = uri.getHost();
                    int port = uri.getPort();
                    String path = uri.getPath(); // includes leading '/'
                    String query = uri.getQuery();

                    StringBuilder cleanJdbcUrl = new StringBuilder("jdbc:postgresql://");
                    cleanJdbcUrl.append(host);
                    if (port > 0) {
                        cleanJdbcUrl.append(":").append(port);
                    }
                    if (path != null && !path.isEmpty()) {
                        cleanJdbcUrl.append(path);
                    }
                    if (query != null && !query.isEmpty()) {
                        cleanJdbcUrl.append("?").append(query);
                    }

                    properties.setUrl(cleanJdbcUrl.toString());
                } catch (Exception e) {
                    // Fallback string sanitization: remove userInfo before host
                    String cleanUrl = trimmedUrl.replaceFirst("jdbc:", "");
                    cleanUrl = cleanUrl.replaceFirst("^(postgres(ql)?://)[^/@]+@", "$1");
                    if (!cleanUrl.startsWith("jdbc:postgresql://")) {
                        cleanUrl = cleanUrl.replaceFirst("^postgres(ql)?://", "jdbc:postgresql://");
                    }
                    properties.setUrl(cleanUrl);
                }
            } else if (!trimmedUrl.startsWith("jdbc:")) {
                properties.setUrl("jdbc:postgresql://" + trimmedUrl);
            }
        }
        return properties.initializeDataSourceBuilder().build();
    }
}
