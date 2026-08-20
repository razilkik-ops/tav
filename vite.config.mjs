import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handleChatRequest } from "./worker/index.js";

function deepSeekDevApi(runtimeEnv) {
  return {
    name: "tav-deepseek-dev-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const origin = `http://${request.headers.host || "localhost"}`;
        const url = new URL(request.originalUrl || request.url || "/", origin);
        if (url.pathname !== "/api/chat") return next();

        const chunks = [];
        for await (const chunk of request) chunks.push(chunk);
        const method = request.method || "GET";
        const webRequest = new Request(url, {
          method,
          headers: request.headers,
          body: ["GET", "HEAD"].includes(method) ? undefined : Buffer.concat(chunks),
          duplex: "half",
        });
        const webResponse = await handleChatRequest(webRequest, runtimeEnv);

        response.statusCode = webResponse.status;
        webResponse.headers.forEach((value, name) => response.setHeader(name, value));
        response.end(Buffer.from(await webResponse.arrayBuffer()));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const runtimeEnv = { ...process.env, ...loadEnv(mode, process.cwd(), "") };
  return {
    base: process.env.GITHUB_ACTIONS === "true" ? "/tav/" : "/",
    build: {
      outDir: "dist/client",
    },
    optimizeDeps: {
      include: ["react", "react-dom/client"],
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
      warmup: {
        clientFiles: ["./src/main.jsx"],
      },
    },
    plugins: [react(), deepSeekDevApi(runtimeEnv)],
  };
});
