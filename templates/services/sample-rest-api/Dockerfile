# Sample REST API ACE Microservice
# Copy the main Dockerfile template and customize for this service
# See: ../../Dockerfile for the reference template

FROM cp.icr.io/cp/appc/ace-server-prod:12.0.11.0-r1

COPY bar/*.bar /home/aceuser/initial-config/bars/
COPY config/server.conf.yaml /home/aceuser/initial-config/serverconf/

EXPOSE 7600 7800

ENV LICENSE=accept
ENV ACE_SERVER_NAME=sample-rest-api
