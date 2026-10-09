import { Router } from "express";
import type { AuthStore } from "../auth/store.js";
export declare function createAdminRouter(store: AuthStore, now?: () => number): Router;
