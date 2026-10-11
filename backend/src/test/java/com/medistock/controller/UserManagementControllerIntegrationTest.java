package com.medistock.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medistock.dto.request.ForgotPasswordRequest;
import com.medistock.dto.request.ResetPasswordRequest;
import com.medistock.dto.request.SignupRequest;
import com.medistock.entity.Role;
import com.medistock.entity.Supplier;
import com.medistock.repository.RoleRepository;
import com.medistock.repository.SupplierRepository;
import com.medistock.repository.UserRepository;
import com.medistock.service.PasswordResetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:medistock_usermgmt_test;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DEFAULT_NULL_ORDERING=HIGH",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=none",
        "spring.flyway.enabled=true",
        "spring.flyway.baseline-on-migrate=true",
        "spring.flyway.baseline-version=0",
        "spring.flyway.locations=classpath:db/migration",
        "app.mail.enabled=false"
})
class UserManagementControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetService passwordResetService;

    private Long testSupplierId;

    @BeforeEach
    void setUp() {
        // Ensure roles exist
        if (roleRepository.findByName("ADMIN").isEmpty()) roleRepository.save(new Role(null, "ADMIN"));
        if (roleRepository.findByName("PHARMACIST").isEmpty()) roleRepository.save(new Role(null, "PHARMACIST"));
        if (roleRepository.findByName("STAFF").isEmpty()) roleRepository.save(new Role(null, "STAFF"));
        if (roleRepository.findByName("SUPPLIER").isEmpty()) roleRepository.save(new Role(null, "SUPPLIER"));

        if (supplierRepository.count() == 0) {
            Supplier s = supplierRepository.save(new Supplier(null, "Test Supplier Pharma", "1234567890", "test@supplier.com", "Main St", LocalDateTime.now()));
            testSupplierId = s.getId();
        } else {
            testSupplierId = supplierRepository.findAll().get(0).getId();
        }
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("Admin can successfully create a STAFF user")
    void testAdminCreateStaffUser() throws Exception {
        SignupRequest req = new SignupRequest("Jane Staff", "janestaff", "janestaff@medistock.com", "password123", "STAFF", null);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("janestaff"))
                .andExpect(jsonPath("$.data.role").value("STAFF"))
                .andExpect(jsonPath("$.data.password").doesNotExist());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("Admin can successfully create a PHARMACIST user")
    void testAdminCreatePharmacistUser() throws Exception {
        SignupRequest req = new SignupRequest("Bob Pharma", "bobpharma", "bobpharma@medistock.com", "password123", "PHARMACIST", null);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("bobpharma"))
                .andExpect(jsonPath("$.data.role").value("PHARMACIST"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("Admin can successfully create a SUPPLIER user with valid supplierId")
    void testAdminCreateSupplierUser() throws Exception {
        SignupRequest req = new SignupRequest("Sam Supplier", "samsupplier", "samsupplier@medistock.com", "password123", "SUPPLIER", testSupplierId);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("samsupplier"))
                .andExpect(jsonPath("$.data.role").value("SUPPLIER"))
                .andExpect(jsonPath("$.data.supplierId").value(testSupplierId));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("Creating SUPPLIER user without supplierId returns 400 Bad Request")
    void testAdminCreateSupplierUserWithoutSupplierId() throws Exception {
        SignupRequest req = new SignupRequest("Sam Supplier Missing", "samsupplier_nosup", "samsupplier_nosup@medistock.com", "password123", "SUPPLIER", null);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(containsString("Supplier account must be linked")));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("Duplicate username is rejected with 409 Conflict")
    void testAdminCreateDuplicateUsername() throws Exception {
        SignupRequest req1 = new SignupRequest("User First", "uniqueuser1", "first@medistock.com", "password123", "STAFF", null);
        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req1)))
                .andExpect(status().isOk());

        SignupRequest req2 = new SignupRequest("User Second", "uniqueuser1", "second@medistock.com", "password123", "STAFF", null);
        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value(containsString("Username already exists")));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("Duplicate email is rejected with 409 Conflict")
    void testAdminCreateDuplicateEmail() throws Exception {
        SignupRequest req1 = new SignupRequest("Email First", "emailfirst", "common@medistock.com", "password123", "STAFF", null);
        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req1)))
                .andExpect(status().isOk());

        SignupRequest req2 = new SignupRequest("Email Second", "emailsecond", "common@medistock.com", "password123", "STAFF", null);
        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value(containsString("Email already exists")));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("Invalid role is rejected with 400 Bad Request")
    void testAdminCreateInvalidRole() throws Exception {
        SignupRequest req = new SignupRequest("Invalid Role User", "invalidroleuser", "invalidrole@medistock.com", "password123", "SUPERUSER", null);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("Invalid role")));
    }

    @Test
    @WithMockUser(username = "staffuser", roles = {"STAFF"})
    @DisplayName("Non-admin user cannot access POST /users (403 Forbidden)")
    void testNonAdminCannotCreateUsers() throws Exception {
        SignupRequest req = new SignupRequest("Staff Hacker", "staffhacker", "staffhacker@medistock.com", "password123", "STAFF", null);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Unauthenticated user cannot access POST /users (401 Unauthorized)")
    void testUnauthenticatedCannotCreateUsers() throws Exception {
        SignupRequest req = new SignupRequest("Unauth User", "unauthuser", "unauthuser@medistock.com", "password123", "STAFF", null);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Public registration cannot assign ADMIN role (400 Bad Request)")
    void testPublicRegistrationCannotCreateAdmin() throws Exception {
        SignupRequest req = new SignupRequest("Sneaky Admin", "sneakyadmin", "sneaky@medistock.com", "password123", "ADMIN", null);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("Public registration cannot assign Admin privileges")));
    }

    @Test
    @DisplayName("Public POST /auth/forgot-password returns 200 with generic message for both valid and unknown email")
    void testPublicForgotPasswordGenericResponse() throws Exception {
        // Unknown email
        ForgotPasswordRequest unknownReq = new ForgotPasswordRequest("nonexistent@medistock.com");
        mockMvc.perform(post("/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(unknownReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value(containsString("If an account with that email exists")));

        // Existing email
        SignupRequest signup = new SignupRequest("Reset User", "resetuser", "resetuser@medistock.com", "password123", "STAFF", null);
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isCreated());

        ForgotPasswordRequest validReq = new ForgotPasswordRequest("resetuser@medistock.com");
        mockMvc.perform(post("/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value(containsString("If an account with that email exists")));
    }

    @Test
    @DisplayName("End-to-end forgot-password and reset-password with new password login verification")
    void testEndToEndPasswordResetAndLogin() throws Exception {
        // 1. Register a test user
        SignupRequest signup = new SignupRequest("E2E User", "e2euser", "e2euser@medistock.com", "initialPass123", "STAFF", null);
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isCreated());

        // 2. Request forgot-password
        ForgotPasswordRequest forgotReq = new ForgotPasswordRequest("e2euser@medistock.com");
        mockMvc.perform(post("/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(forgotReq)))
                .andExpect(status().isOk());

        // 3. Retrieve generated token from dev cache
        String rawToken = passwordResetService.getDevToken("e2euser@medistock.com");
        assertNotNull(rawToken, "Dev token should be generated for reset");

        // 4. Submit reset-password with valid token and new password
        ResetPasswordRequest resetReq = new ResetPasswordRequest(rawToken, "brandNewSecret456");
        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value(containsString("Password has been reset successfully")));

        // 5. Try to reset again with same token (should be rejected as already used)
        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("already been used")));

        // 6. Verify old password no longer logs in
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"e2euser\",\"password\":\"initialPass123\",\"role\":\"STAFF\"}"))
                .andExpect(status().isUnauthorized());

        // 7. Verify new password successfully logs in
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"e2euser\",\"password\":\"brandNewSecret456\",\"role\":\"STAFF\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").exists());
    }
}
