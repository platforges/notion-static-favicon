import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    environmentOptions: { jsdom: { url: "https://www.notion.so/" } },
    include: ["tests/**/*.test.ts"],
  },
});
