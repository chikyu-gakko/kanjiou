import { rest, setupWorker } from "msw";
<<<<<<< HEAD
import ranks from "./ranks.json";

const handlers = [
  rest.get("/api/ranks/:secondsLeft", (req, res, ctx) => {
    const secondsLeft = req.url.searchParams.get("secondsLeft");
    console.log(`secondsLeft: ${secondsLeft}`);
    return res(
      ctx.status(200),
      ctx.json({
        rankOrder: 1,
      })
    );
  }),

  rest.get("/api/ranks", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(ranks));
  }),

  rest.post("/api/records", (req, res, ctx) => {
    const body = req.body;
    console.log(`body: ${JSON.stringify(body)}`);
    return res(ctx.status(200));
  }),
=======

const handlers = [
  rest.get("/users", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        username: "admin",
      })
    );
  }),
>>>>>>> ca18a23 (:wrench: Add configuration msw)
];
// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);
