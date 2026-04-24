import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isValidLocale } from "@/i18n";
import { QUICK_ADD_ENTITIES } from "@/components/merchant/quickAddEntities";
import { CreateEntityPlaceholder } from "./CreateEntityPlaceholder";

export default async function CreateEntityPage({
  params,
}: {
  params: Promise<{ locale: string; entity: string }>;
}) {
  const { locale, entity } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const match = QUICK_ADD_ENTITIES.find((e) => e.id === entity);
  if (!match) notFound();

  return (
    <CreateEntityPlaceholder
      locale={locale}
      entityId={match.id}
      labelKey={match.labelKey}
      target={match.target}
      accent={match.accent}
    />
  );
}
