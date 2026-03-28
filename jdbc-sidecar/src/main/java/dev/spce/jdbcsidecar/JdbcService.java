package dev.spce.jdbcsidecar;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import dev.spce.jdbcsidecar.dto.SqlRequest;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Pool Hikari por URL JDBC. Padrão: H2 em 192.168.0.117 (sobrescreva com JDBC_URL / H2_USER / H2_PASSWORD).
 */
public final class JdbcService {

    private static final String ENV_JDBC_URL = "JDBC_URL";
    private static final String ENV_USER = "H2_USER";
    private static final String ENV_PASSWORD = "H2_PASSWORD";
    private static final String ENV_TCP_PORT = "H2_TCP_PORT";

    /** Host padrão quando o corpo não envia {@code connection.host} → mesma máquina da string jdbc abaixo. */
    private static final String DEFAULT_HOST = "192.168.0.117";

    private static final String DEFAULT_USER = "sa";
    private static final String DEFAULT_PASSWORD = "SPCE16 2016 H2 SPCE16 H2 FINAL";

    private final Map<String, HikariDataSource> pools = new ConcurrentHashMap<>();

    private static String firstNonBlank(String a, String fallback) {
        if (a != null && !a.isBlank()) {
            return a.trim();
        }
        return fallback;
    }

    /** Remove ponto e vírgula final (comum em strings copiadas de configs). */
    private static String normalizeJdbcUrl(String url) {
        return url.trim().replaceAll(";+$", "");
    }

    private static String jdbcUser() {
        return firstNonBlank(System.getenv(ENV_USER), DEFAULT_USER);
    }

    private static String jdbcPassword() {
        return firstNonBlank(System.getenv(ENV_PASSWORD), DEFAULT_PASSWORD);
    }

    private static String hostOrDefault(SqlRequest body) {
        if (body != null
                && body.connection != null
                && body.connection.host != null
                && !body.connection.host.isBlank()) {
            return body.connection.host.trim();
        }
        return DEFAULT_HOST;
    }

    /**
     * Se {@code JDBC_URL} estiver definida, usa ela; senão monta a URL com host (corpo ou padrão) e porta.
     */
    private String resolveJdbcUrl(SqlRequest body) {
        String fromEnv = System.getenv(ENV_JDBC_URL);
        if (fromEnv != null && !fromEnv.isBlank()) {
            return normalizeJdbcUrl(fromEnv);
        }
        String host = hostOrDefault(body);
        String port = firstNonBlank(System.getenv(ENV_TCP_PORT), "9092");
        return "jdbc:h2:tcp://"
                + host
                + ":"
                + port
                + "/./bancodados/spce.2018;AUTO_RECONNECT=TRUE;CIPHER=AES";
    }

    private HikariDataSource poolFor(SqlRequest body) {
        String url = resolveJdbcUrl(body);
        return pools.computeIfAbsent(
                url,
                u -> {
                    HikariConfig cfg = new HikariConfig();
                    cfg.setJdbcUrl(u);
                    cfg.setDriverClassName("org.h2.Driver");
                    cfg.setUsername(jdbcUser());
                    cfg.setPassword(jdbcPassword());
                    cfg.setMaximumPoolSize(10);
                    cfg.setPoolName("spce-h2-" + Integer.toHexString(u.hashCode()));
                    return new HikariDataSource(cfg);
                });
    }

    /**
     * Executa qualquer SQL: SELECT → lista de linhas; INSERT/UPDATE/DELETE/DDL → contagem de linhas afetadas (ou 0).
     */
    public Object execute(SqlRequest body) throws SQLException {
        validate(body);
        try (Connection conn = poolFor(body).getConnection();
                Statement st = conn.createStatement()) {
            boolean isResultSet = st.execute(body.query);
            if (isResultSet) {
                try (ResultSet rs = st.getResultSet()) {
                    return toRows(rs);
                }
            }
            return st.getUpdateCount();
        }
    }

    private static void validate(SqlRequest body) {
        if (body == null || body.query == null || body.query.isBlank()) {
            throw new IllegalArgumentException("query é obrigatória");
        }
    }

    private static List<Map<String, Object>> toRows(ResultSet rs) throws SQLException {
        List<Map<String, Object>> rows = new ArrayList<>();
        ResultSetMetaData meta = rs.getMetaData();
        int cols = meta.getColumnCount();
        while (rs.next()) {
            Map<String, Object> row = new LinkedHashMap<>();
            for (int c = 1; c <= cols; c++) {
                String label = meta.getColumnLabel(c);
                row.put(label, rs.getObject(c));
            }
            rows.add(row);
        }
        return rows;
    }

    public void close() {
        pools.values()
                .forEach(
                        ds -> {
                            try {
                                ds.close();
                            } catch (Exception ignored) {
                                // ignore
                            }
                        });
        pools.clear();
    }
}
