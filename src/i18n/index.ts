import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ptBR from "../locales/pt-BR.json";

export const defaultNS = "translation";
export const resources = {
  "pt-BR": {
    translation: ptBR,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: "pt-BR",
  fallbackLng: "pt-BR",
  resources,
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
});

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["pt-BR"];
  }
}

export default i18n;
