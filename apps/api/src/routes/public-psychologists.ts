import { Router } from "express";
import { PsychologistProfile } from "../database/models/index.js";

export interface VerifiedPsychologistRepository {
  listVerified(): Promise<unknown[]>;
}

export class MongoVerifiedPsychologistRepository implements VerifiedPsychologistRepository {
  async listVerified() {
    return PsychologistProfile.find({ verificationStatus: "verified" })
      .select(
        "professionalTitle bio specializations yearsOfExperience languages sessionTypes availability pricing faithCompatibility country",
      )
      .lean();
  }
}

export function createPublicPsychologistsRouter(
  repository: VerifiedPsychologistRepository = new MongoVerifiedPsychologistRepository(),
): Router {
  const router = Router();
  router.get("/discovery", async (_request, response, next) => {
    try {
      return response.json({ psychologists: await repository.listVerified() });
    } catch (error) {
      return next(error);
    }
  });
  return router;
}
