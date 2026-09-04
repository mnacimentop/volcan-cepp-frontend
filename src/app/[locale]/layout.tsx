import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/common/translation/routing";
import { getAppProviderState } from "./get-app-provider-state";
import { Providers } from "./providers";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Readonly<Props>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const providerState = await getAppProviderState(locale);

  return <Providers {...providerState}>{children}</Providers>;
}
