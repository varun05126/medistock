package com.medistock.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService,
                          JwtAuthenticationFilter jwtAuthenticationFilter,
                          org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptions -> exceptions
                    .authenticationEntryPoint((request, response, authException) -> {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                        response.getWriter().write("{\"success\":false,\"message\":\"Full authentication is required to access this resource\",\"status\":401}");
                    })
                    .accessDeniedHandler((request, response, accessDeniedException) -> {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                        response.getWriter().write("{\"success\":false,\"message\":\"Access denied: insufficient permissions\",\"status\":403}");
                    })
            )
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(
                            "/",
                            "/health",
                            "/health/**",
                            "/auth/login",
                            "/auth/signin",
                            "/auth/register",
                            "/auth/signup",
                            "/v3/api-docs/**",
                            "/swagger-ui/**",
                            "/swagger-ui.html"
                    ).permitAll()
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    // Supplier endpoints (accessible to Supplier and Admin)
                    .requestMatchers("/suppliers/me", "/suppliers/me/**").hasAnyRole("SUPPLIER", "ADMIN")
                    // Admin only endpoints
                    .requestMatchers("/users", "/users/**", "/admin/**").hasRole("ADMIN")
                    // Inventory, medicines, stock and category management
                    .requestMatchers("/inventory/**", "/medicines/**", "/stock/**", "/categories", "/categories/**").hasAnyRole("ADMIN", "PHARMACIST", "STAFF")
                    .requestMatchers("/suppliers/**").hasAnyRole("ADMIN", "PHARMACIST")
                    .requestMatchers("/orders/**").hasAnyRole("ADMIN", "PHARMACIST")
                    .requestMatchers("/reports/**").hasAnyRole("ADMIN", "PHARMACIST")
                    .requestMatchers("/analytics/**").hasAnyRole("ADMIN", "PHARMACIST", "STAFF")
                    .requestMatchers("/expiry/**").hasAnyRole("ADMIN", "PHARMACIST")
                    .requestMatchers("/notifications/**").authenticated()
                    .requestMatchers("/auth/me").authenticated()
                    .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
