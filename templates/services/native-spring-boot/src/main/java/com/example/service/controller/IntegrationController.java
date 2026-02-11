package com.example.service.controller;

import com.example.service.service.TransformationService;
import io.micrometer.core.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller — replaces ACE HTTPInput + HTTPReply nodes.
 *
 * ACE equivalent:
 *   HTTPInput → Compute Node (ESQL) → HTTPReply
 */
@RestController
@RequestMapping("/api")
public class IntegrationController {

    private static final Logger log = LoggerFactory.getLogger(IntegrationController.class);
    private final TransformationService transformationService;

    public IntegrationController(TransformationService transformationService) {
        this.transformationService = transformationService;
    }

    /**
     * Replaces: ACE HTTPInput node listening on /api/process
     * The ESQL compute logic is now in TransformationService.
     */
    @PostMapping("/process")
    @Timed(value = "integration.process", description = "Time to process integration request")
    public ResponseEntity<Map<String, Object>> process(@RequestBody Map<String, Object> input) {
        log.info("Received integration request: {}", input.getOrDefault("type", "unknown"));

        Map<String, Object> result = transformationService.transform(input);

        return ResponseEntity.ok(result);
    }

    /**
     * Health endpoint — replaces ACE admin API /apiv2/servers check.
     * Spring Actuator also provides /actuator/health automatically.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
