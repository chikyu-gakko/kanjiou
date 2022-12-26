import { rest, setupWorker } from "msw";
import time_limits from "./time_limits.json";

const handlers = [
  rest.get("/api/time_limits/time_limit", (req, res, ctx) => {
    const seconds = req.url.searchParams.get("seconds");
    console.log(`seconds: ${seconds}`);
    return res(
      ctx.status(200),
      ctx.json({
        rank: 1,
      })
    );
  }),

  rest.get("/api/time_limits", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(time_limits));
  }),

  rest.post("/api/time_limits", (req, res, ctx) => {
    const body = req.body;
    console.log(`body: ${JSON.stringify(body)}`);
    return res(ctx.status(200));
  }),
];
// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);
