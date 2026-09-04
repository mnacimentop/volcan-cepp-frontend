import {
  AppProviders,
  createIntlProviderPlugin,
  type ProviderPlugin,
} from "@pormeldev/next-runtime-kit";
import type { getMessages } from "next-intl/server";
import type { ReactNode } from "react";

type Props = {
  locale: string;
  messages: Awaited<ReturnType<typeof getMessages>>;
  children: ReactNode;
};

export function Providers({ locale, messages, children }: Readonly<Props>) {
  const plugins: ProviderPlugin[] = [
    createIntlProviderPlugin({
      locale,
      messages,
    }),
  ];

  return <AppProviders plugins={plugins}>{children}</AppProviders>;
}
