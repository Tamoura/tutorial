# =============================================================================
# IBM ACE Microservice Container Image
# =============================================================================
# This Dockerfile packages a single ACE integration service as a container.
# Replace placeholder values (marked with <...>) with your actual values.
#
# Build:  docker build -t <registry>/<service-name>:<tag> .
# Run:    docker run -p 7600:7600 -p 7800:7800 <registry>/<service-name>:<tag>
# =============================================================================

# --- Stage 1: Build the BAR file ---
FROM cp.icr.io/cp/appc/ace-full:12.0.11.0-r1 AS builder

# Copy ACE project source files
COPY ace-src/ /home/aceuser/ace-src/

# Build the BAR file using mqsipackagebar
RUN bash -c '\
    source /opt/ibm/ace-12/server/bin/mqsiprofile && \
    mqsipackagebar \
        -a /home/aceuser/output/service.bar \
        -w /home/aceuser/ace-src \
        -k <ApplicationName> \
    '

# --- Stage 2: Production runtime image ---
FROM cp.icr.io/cp/appc/ace-server-prod:12.0.11.0-r1

LABEL maintainer="your-team@company.com"
LABEL description="ACE microservice - <ServiceName>"

# Copy the built BAR file
COPY --from=builder /home/aceuser/output/service.bar /home/aceuser/initial-config/bars/

# Copy server configuration (override defaults)
COPY config/server.conf.yaml /home/aceuser/initial-config/serverconf/

# Copy policy files if needed
# COPY config/policies/ /home/aceuser/initial-config/policy/

# Copy setdbparms configuration if needed
# COPY config/setdbparms.txt /home/aceuser/initial-config/setdbparms/

# Copy truststore/keystore if needed
# COPY config/truststore.jks /home/aceuser/initial-config/truststore/
# COPY config/keystore.jks  /home/aceuser/initial-config/keystore/

# Expose ACE web admin (7600) and HTTP listener (7800)
EXPOSE 7600 7800

# Health check using ACE admin REST API
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:7600/apiv2/servers/defaultServer || exit 1

# The base image already sets the entrypoint to start the ACE integration server
# Environment variables can override server.conf.yaml settings at runtime:
#   ACE_SERVER_NAME       - Integration server name
#   ACE_TRUSTSTORE_PASSWORD - Truststore password
#   LICENSE               - Set to "accept" to accept the license
ENV LICENSE=accept
ENV ACE_SERVER_NAME=defaultServer
