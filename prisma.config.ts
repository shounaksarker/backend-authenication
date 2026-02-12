import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const db_user = env("DATABASE_USER");
const db_password = env("DATABASE_PASSWORD");
const db_host = env("DATABASE_HOST");
const db_port = env("DATABASE_PORT");
const db_name = env("DATABASE_NAME");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: `mysql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`,
  },
});
