package com.example.MarioFratarcangeli.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers("/login", "/css/**", "/js/**").permitAll() // Pagine pubbliche
                .anyRequest().authenticated() // Tutte le altre pagine richiedono autenticazione
                .and()
                .formLogin()
                .loginPage("/login") // URL della tua pagina di login
                .defaultSuccessUrl("/home", true) // Dove andare dopo il login
                .permitAll()
                .and()
                .logout()
                .logoutUrl("/logout") // URL per il logout
                .logoutSuccessUrl("/login?logout") // Dove andare dopo il logout
                .permitAll();
        return http.build();
    }

    @Bean
    public InMemoryUserDetailsManager userDetailsService() {
        UserDetails user = User.builder()
                .username("mario")
                .password(passwordEncoder().encode("mario"))
                .roles("USER")
                .build();
        return new InMemoryUserDetailsManager(user);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
