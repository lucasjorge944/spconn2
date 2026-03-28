package dev.spce.jdbcsidecar;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.spce.jdbcsidecar.dto.SqlRequest;
import io.javalin.Javalin;
import io.javalin.http.Context;

import java.util.Map;

public final class JdbcSidecarApplication {

    private static final ObjectMapper JSON = new ObjectMapper();
    private static final String ENV_PORT = "JDBC_SIDECAR_PORT";

    public static void main(String[] args) {
        int port = parsePort();
        JdbcService jdbc = new JdbcService();

        Runtime.getRuntime().addShutdownHook(new Thread(jdbc::close));

        Javalin app = Javalin.create(config -> config.showJavalinBanner = false);

        app.get("/health", ctx -> ctx.result("ok"));

        app.post("/exec", ctx -> handleExec(ctx, jdbc));

        app.exception(Exception.class, (e, ctx) -> {
            if (e instanceof IllegalArgumentException) {
                ctx.status(400).json(Map.of("error", e.getMessage()));
                return;
            }
            ctx.status(500).json(Map.of("error", e.getMessage() != null ? e.getMessage() : "erro interno"));
        });

        app.start(port);
        System.out.println("jdbc-sidecar escutando em http://127.0.0.1:" + port);
    }

    private static void handleExec(Context ctx, JdbcService jdbc) throws Exception {
        SqlRequest body = JSON.readValue(ctx.bodyAsBytes(), SqlRequest.class);
        Object result = jdbc.execute(body);
        ctx.json(Map.of("query", body.query, "results", result));
    }

    private static int parsePort() {
        String raw = System.getenv(ENV_PORT);
        if (raw == null || raw.isBlank()) {
            return 18080;
        }
        try {
            return Integer.parseInt(raw.trim());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("JDBC_SIDECAR_PORT inválida: " + raw);
        }
    }
}
