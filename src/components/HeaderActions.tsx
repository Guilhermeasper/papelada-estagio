import { useTheme } from "@papelada-estagio/hooks";
import { useEffect, useRef, useState } from "react";
import { Button, ThemeToggle } from "./";

interface HeaderActionsProps {
  hasProgress: boolean;
  onImport: () => void;
  onExport: () => void;
  onReset: () => void;
}

function ThemeToggleButton() {
  const { effectiveTheme, toggleTheme } = useTheme();
  const isDark = effectiveTheme === "dark";

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      className="w-full justify-start px-4 py-2.5 font-normal"
    >
      {isDark ? (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
      {isDark ? "Tema claro" : "Tema escuro"}
    </Button>
  );
}

function MobileActionsDropdown({
  hasProgress,
  onImport,
  onExport,
  onReset,
}: HeaderActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative md:hidden">
      <Button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        variant="ghost"
        size="icon"
        aria-label="Opções"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>

        {hasProgress && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg shadow-lg border border-border dark:border-border-dark py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {hasProgress && (
            <>
              <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary dark:text-text-secondary-dark">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Progresso salvo
              </div>
              <div className="border-t border-border dark:border-border-dark my-1" />
            </>
          )}

          <ThemeToggleButton />

          <div className="border-t border-border dark:border-border-dark my-1" />

          <Button
            onClick={() => {
              onImport();
              setIsOpen(false);
            }}
            variant="ghost"
            className="w-full justify-start px-4 py-2.5 font-normal"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Importar
          </Button>

          {hasProgress && (
            <>
              <Button
                onClick={() => {
                  onExport();
                  setIsOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start px-4 py-2.5 font-normal"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Exportar
              </Button>

              <div className="border-t border-border dark:border-border-dark my-1" />

              <Button
                onClick={() => {
                  onReset();
                  setIsOpen(false);
                }}
                variant="danger-ghost"
                className="w-full justify-start px-4 py-2.5 font-normal"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Limpar dados
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function HeaderActions({
  hasProgress,
  onImport,
  onExport,
  onReset,
}: HeaderActionsProps) {
  return (
    <>
      <MobileActionsDropdown
        hasProgress={hasProgress}
        onImport={onImport}
        onExport={onExport}
        onReset={onReset}
      />

      <div className="hidden md:flex items-center gap-2">
        {hasProgress && (
          <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-text-secondary-dark">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Salvo</span>
          </div>
        )}

        <Button
          onClick={onImport}
          variant="ghost"
          size="sm"
          title="Importar progresso de arquivo JSON"
        >
          Importar
        </Button>

        {hasProgress && (
          <>
            <Button
              onClick={onExport}
              variant="ghost"
              size="sm"
              title="Exportar progresso como JSON"
            >
              Exportar
            </Button>

            <Button onClick={onReset} variant="danger-ghost" size="sm">
              Limpar
            </Button>
          </>
        )}

        <ThemeToggle />
      </div>
    </>
  );
}
