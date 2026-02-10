import type { ReactNode } from "react";
import { getAssetPath } from "./utils/asset";

interface AppLayoutProps {
  children: ReactNode;
  headerActions?: ReactNode;
}

export function AppLayout({ children, headerActions }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark flex flex-col">
      <header className="bg-surface-elevated dark:bg-surface-elevated-dark border-b border-border dark:border-border-dark">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <img
                src={getAssetPath("/logo.svg")}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-text-primary dark:text-text-primary-dark">
                Papelada Estágio
              </h1>
            </div>

            {headerActions && (
              <div className="ml-auto flex items-center gap-2">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-surface-elevated dark:bg-surface-elevated-dark border-t border-border dark:border-border-dark mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-center text-sm text-text-secondary dark:text-text-secondary-dark">
            © {new Date().getFullYear()} Papelada Estágio
          </p>
        </div>
      </footer>
    </div>
  );
}
