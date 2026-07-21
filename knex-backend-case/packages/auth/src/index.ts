import { createAuthService } from "./service/auth.service";
import { drizzleAuthRepository } from "./repository/auth.repository.drizzle";
import { createAuthRouter } from "./http/auth.route";

const authService = createAuthService(drizzleAuthRepository);

export const authRouter = createAuthRouter(authService);
export { requireAuth, requireRole } from "./middleware";
export type { AuthenticatedUser } from "./middleware";
