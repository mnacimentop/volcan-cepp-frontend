import "server-only";

import { createPinoLogPublisher } from "@pormeldev/axis-client-kit/server";
import type { LogPublisherPort } from "@pormeldev/axis-common-lib";

export const axisLogPublisher: LogPublisherPort = createPinoLogPublisher({
  prefixValue: "axis-frontend-template",
  timeZone: "America/Montevideo",
});
