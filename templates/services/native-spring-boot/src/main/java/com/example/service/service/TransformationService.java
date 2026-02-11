package com.example.service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Transformation service — replaces ACE ESQL Compute Node logic.
 *
 * Move your ESQL business logic here. Each ESQL compute module
 * becomes a Java method.
 *
 * ACE ESQL equivalent:
 *   CREATE COMPUTE MODULE MyFlow_Compute
 *     CREATE FUNCTION Main() RETURNS BOOLEAN
 *       SET OutputRoot.JSON.Data.result = ...transform(InputRoot.JSON.Data)...
 *       RETURN TRUE;
 *     END;
 *   END MODULE;
 */
@Service
public class TransformationService {

    private static final Logger log = LoggerFactory.getLogger(TransformationService.class);

    /**
     * Replace this with your actual ESQL transformation logic.
     */
    public Map<String, Object> transform(Map<String, Object> input) {
        Map<String, Object> output = new HashMap<>();

        // Example: replaces ESQL field mapping
        // SET OutputRoot.JSON.Data.fullName = InputRoot.JSON.Data.firstName || ' ' || InputRoot.JSON.Data.lastName;
        String firstName = (String) input.getOrDefault("firstName", "");
        String lastName = (String) input.getOrDefault("lastName", "");
        output.put("fullName", firstName + " " + lastName);

        // Example: replaces ESQL conditional routing
        // IF InputRoot.JSON.Data.type = 'ORDER' THEN ...
        String type = (String) input.getOrDefault("type", "UNKNOWN");
        output.put("processedType", type);
        output.put("status", "PROCESSED");

        log.info("Transformed message of type: {}", type);

        return output;
    }
}
