import { Router } from "express";
import type { AuthStore } from "../auth/store.js";
export declare function createPsychologistRouter(store: AuthStore, now?: () => number): Router;
