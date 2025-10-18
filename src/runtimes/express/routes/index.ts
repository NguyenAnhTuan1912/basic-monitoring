import { defaultRoutes } from "./default";
import { sampleRoutes } from "./sample";

// Import types
import type { TSwaggerRouteDefinition } from "src/core/docs/swagger/type";

// Route registry
let routes: Array<TSwaggerRouteDefinition> = [];

routes = routes.concat(defaultRoutes);
routes = routes.concat(sampleRoutes);

export { routes };
