import express from "express";
import {
  getRouteController,
  getLegsController,
} from "../controllers/route-controller.js";

const router = express.Router();

router.get("/:olat/:olng/:lat/:lng", getRouteController);
router.get("/legs/:olat/:olng/:lat/:lng", getLegsController);
export default router;
