package com.example.MarioFratarcangeli.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/login", "/css/**", "/js/**").permitAll() // Permetti l'accesso senza autenticazione
                .anyRequest().authenticated() // Tutti gli altri richiedono autenticazione
                .and()
                .formLogin()
                .loginPage("/login") // Mappa la pagina di login
                .defaultSuccessUrl("/") // Reindirizza alla home dopo il login
                .permitAll()
                .and()
                .logout()
                .logoutSuccessUrl("/login") // Reindirizza alla pagina di login dopo il logout
                .invalidateHttpSession(false)
                .permitAll();
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
