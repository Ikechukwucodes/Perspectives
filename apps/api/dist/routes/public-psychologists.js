import { Router } from "express";
import { PsychologistProfile } from "../database/models/index.js";
export class MongoVerifiedPsychologistRepository {
    async listVerified() {
        return PsychologistProfile.find({ verificationStatus: "verified" })
            .select("professionalTitle bio specializations yearsOfExperience languages sessionTypes availability pricing faithCompatibility country")
            .lean();
    }
}
export function createPublicPsychologistsRouter(repository = new MongoVerifiedPsychologistRepository()) {
    const router = Router();
    router.get("/discovery", async (_request, response, next) => {
        try {
            return response.json({ psychologists: await repository.listVerified() });
        }
        catch (error) {
            return next(error);
        }
    });
    return router;
}
