// available-slots.routes.ts
import { Router } from "express";
import { AvailableSlotsController } from "./available-slots.controller";
import { asyncHandler } from "../../shared/middlewares/async-handler";

export function createAvailableSlotsRouter(
  controller: AvailableSlotsController,
): Router {
  const router = Router();

  router.get(
    "/:id/available-slots",
    asyncHandler(controller.getAvailableSlots as any),
  );
  return router;
}
