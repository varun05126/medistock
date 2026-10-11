package com.medistock;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:medistock_test;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DEFAULT_NULL_ORDERING=HIGH",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.flyway.enabled=true",
        "spring.flyway.baseline-on-migrate=true",
        "spring.flyway.baseline-version=0",
        "spring.flyway.locations=classpath:db/migration"
})
class SchemaValidationIntegrationTest {

    @Autowired
    private DataSource dataSource;

    @Test
    @DisplayName("Flyway creates all required schema tables and Hibernate validates successfully")
    void testFlywayAndSchemaValidation() throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            ResultSet rs = conn.getMetaData().getTables(null, null, "%", new String[]{"TABLE"});
            List<String> tables = new ArrayList<>();
            while (rs.next()) {
                tables.add(rs.getString("TABLE_NAME").toLowerCase());
            }

            // Verify all 12 core tables exist
            assertTrue(tables.contains("roles"), "Missing roles table");
            assertTrue(tables.contains("users"), "Missing users table");
            assertTrue(tables.contains("suppliers"), "Missing suppliers table");
            assertTrue(tables.contains("categories"), "Missing categories table");
            assertTrue(tables.contains("medicines"), "Missing medicines table");
            assertTrue(tables.contains("inventory"), "Missing inventory table");
            assertTrue(tables.contains("stock_logs"), "Missing stock_logs table");
            assertTrue(tables.contains("purchase_orders"), "Missing purchase_orders table");
            assertTrue(tables.contains("purchase_order_items"), "Missing purchase_order_items table");
            assertTrue(tables.contains("expiry_tracking"), "Missing expiry_tracking table");
            assertTrue(tables.contains("notifications"), "Missing notifications table");
            assertTrue(tables.contains("reports"), "Missing reports table");
        }
    }
}
