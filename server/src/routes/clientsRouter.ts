import { Router } from "express";
import { companyClients } from "../data/companyClients.js";

export const clientsRouter = Router();

clientsRouter.get("/", (_request, response) => {
  response.json(companyClients);
});
