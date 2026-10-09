import { Router } from "express";
export interface VerifiedPsychologistRepository {
    listVerified(): Promise<unknown[]>;
}
export declare class MongoVerifiedPsychologistRepository implements VerifiedPsychologistRepository {
    listVerified(): Promise<any[]>;
}
export declare function createPublicPsychologistsRouter(repository?: VerifiedPsychologistRepository): Router;
