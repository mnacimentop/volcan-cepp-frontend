import { createIntlNavigation } from "@pormeldev/next-runtime-kit/i18n/navigation";
import { routing } from "./routing";

export const { Link, redirect, getPathname } = createIntlNavigation(routing);
