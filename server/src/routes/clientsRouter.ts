import { Router } from "express";
import { companyClients } from "@nevis-books/shared";

export const clientsRouter = Router();

/** Simulated latency so the UI loading state is visible during local demos. */
const RESPONSE_DELAY_MS = Number(process.env.CLIENTS_DELAY_MS ?? 500);

clientsRouter.get("/", async (_request, response) => {
  if (RESPONSE_DELAY_MS > 0) {
    await new Promise((resolve) => {
      setTimeout(resolve, RESPONSE_DELAY_MS);
    });
  }

  response.json(companyClients);
});
