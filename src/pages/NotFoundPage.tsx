import { Button } from "@papelada-estagio/components";

export function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Página não encontrada
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        O estágiario deve ter movido a página para outro local.
      </p>
      <div className="pt-4">
        <Button
          onClick={() => {
            window.location.hash = "#/";
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white"
        >
          Voltar para o Início
        </Button>
      </div>
    </div>
  );
}
