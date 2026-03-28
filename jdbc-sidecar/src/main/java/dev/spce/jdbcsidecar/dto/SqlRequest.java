package dev.spce.jdbcsidecar.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SqlRequest {

    public ConnectionPayload connection;
    public String query;

    public static final class ConnectionPayload {
        public String host;
    }
}
