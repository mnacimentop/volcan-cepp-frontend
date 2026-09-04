import { Button, Text } from "@pormeldev/axis-design-system";
import Link from "next/link";

export default function RootNotFound() {
  return (
    <main data-testid="root-not-found-page">
      <Text as="h1" testId="root-not-found-page-title">
        Página no encontrada
      </Text>
      <Text as="p" testId="root-not-found-page-description">
        La página que buscás no está disponible en esta app Axis.
      </Text>
      <div>
        <Link href="/">
          <Button color="secondary" size="md" testId="root-not-found-back-home">
            Volver
          </Button>
        </Link>
      </div>
    </main>
  );
}
