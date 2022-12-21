import { rest, setupWorker } from "msw";

const handlers = [
  rest.get("/users", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        username: "admin",
      })
    );
  }),
];
// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);
