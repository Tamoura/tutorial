package com.example.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Native microservice replacing an ACE integration flow.
 *
 * This replaces:
 *   - ACE HTTPInput node  → Spring @RestController
 *   - ACE Compute node    → Service layer methods
 *   - ACE HTTPReply node  → Spring ResponseEntity
 *   - ACE Error handling  → @ExceptionHandler
 *   - ACE Monitoring      → Spring Actuator + Micrometer
 */
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
