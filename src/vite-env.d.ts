/// <reference types="vite/client" />

// Declaração para importar arquivos PDF como assets
declare module '*.pdf' {
  const src: string;
  export default src;
}
