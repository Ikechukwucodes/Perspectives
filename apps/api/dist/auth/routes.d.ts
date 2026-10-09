import { Router } from "express";
import { type AuthStore } from "./store.js";
export declare function createAuthRouter(store: AuthStore, now?: () => number): Router;
