import { Button } from "@papelada-estagio/components";
import { useTranslation } from "react-i18next";

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">
        {t("pages.notFound.title")}
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
        {t("pages.notFound.subtitle")}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        {t("pages.notFound.description")}
      </p>
      <div className="pt-4">
        <Button
          onClick={() => {
            window.location.hash = "#/";
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white"
        >
          {t("pages.notFound.backHome")}
        </Button>
      </div>
    </div>
  );
}
