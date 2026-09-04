import { getMessages, setRequestLocale } from "next-intl/server";

export async function getAppProviderState(locale: string) {
  setRequestLocale(locale);

  return {
    locale,
    messages: await getMessages(),
  };
}
