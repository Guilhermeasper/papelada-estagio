import { Button } from "@papelada-estagio/components";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export function DebugPage() {
  const { t } = useTranslation();
  const [activePreview, setActivePreview] = useState<string | null>(null);

  const previewRoutes = useMemo(
    () => [
      {
        path: "#/preview",
        label: t("pages.debug.previewRoutes.activityPlan"),
      },
      { path: "#/report", label: t("pages.debug.previewRoutes.report") },
      {
        path: "#/advisor-eval",
        label: t("pages.debug.previewRoutes.advisorEval"),
      },
      {
        path: "#/supervisor-eval",
        label: t("pages.debug.previewRoutes.supervisorEval"),
      },
    ],
    [t],
  );

  const getPreviewUrl = (hashPath: string) => {
    return `${window.location.origin}${window.location.pathname}${hashPath}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("pages.debug.title")}
        </h1>
        <Button
          onClick={() => {
            window.location.hash = "#/";
          }}
          variant="outline"
        >
          {t("pages.debug.backHome")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {t("pages.debug.documents")}
          </h2>
          <div className="flex flex-col space-y-2">
            {previewRoutes.map((route) => (
              <Button
                key={route.path}
                variant={activePreview === route.path ? "primary" : "outline"}
                onClick={() => setActivePreview(route.path)}
                className="w-full justify-start"
              >
                {route.label}
              </Button>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {t("pages.debug.routeTest")}
            </h3>
            <Button
              variant="outline"
              onClick={() => {
                window.location.hash = "#/non-existent-route";
              }}
              className="w-full justify-start text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20"
            >
              {t("pages.debug.test404")}
            </Button>
          </div>
        </div>

        <div className="md:col-span-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[600px] flex flex-col">
          {activePreview ? (
            <div className="flex-1 flex flex-col">
              <div className="bg-white dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm">
                <span className="font-mono text-gray-500">{activePreview}</span>
                <a
                  href={getPreviewUrl(activePreview)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {t("pages.debug.openNewTab")}
                </a>
              </div>
              <iframe
                src={getPreviewUrl(activePreview)}
                className="flex-1 w-full h-full border-0"
                title={`Preview ${activePreview}`}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <p>{t("pages.debug.emptyState")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
