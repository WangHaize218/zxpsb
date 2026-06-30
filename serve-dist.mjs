import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";

const host = "127.0.0.1";
const port = 4174;
const root = join(process.cwd(), "dist");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

function resolvePath(urlPath) {
  const cleanPath = decodeURIComponent((urlPath || "/").split("?")[0]);
  const relativePath = cleanPath === "/" ? "index.html" : cleanPath.replace(/^\/+/, "");
  const candidate = normalize(join(root, relativePath));

  if (candidate.startsWith(root) && existsSync(candidate) && !statSync(candidate).isDirectory()) {
    return candidate;
  }

  return join(root, "index.html");
}

const server = createServer((request, response) => {
  const filePath = resolvePath(request.url);
  const contentType = contentTypes[extname(filePath).toLowerCase()] || "application/octet-stream";

  response.writeHead(200, { "Content-Type": contentType });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Serving dist at http://${host}:${port}`);
});
