import { Router } from "express";
import { companyClients } from "../data/companyClients.js";

export const clientsRouter = Router();

/** Simulated latency so the UI loading state is visible during local demos. */
const parsedDelay = Number(process.env.CLIENTS_DELAY_MS ?? 500);
const RESPONSE_DELAY_MS = Number.isFinite(parsedDelay) && parsedDelay >= 0
  ? parsedDelay
  : 500;

clientsRouter.get("/", async (_request, response) => {
  if (RESPONSE_DELAY_MS > 0) {
    await new Promise((resolve) => {
      setTimeout(resolve, RESPONSE_DELAY_MS);
    });
  }

  response.json(companyClients);
});
