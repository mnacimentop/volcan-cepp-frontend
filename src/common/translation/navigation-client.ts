"use client";

import { createIntlNavigation } from "@pormeldev/next-runtime-kit/i18n/navigation";
import { routing } from "./routing";

export const { Link, usePathname, useRouter } = createIntlNavigation(routing);
