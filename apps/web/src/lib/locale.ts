export const LOCALES = ["en", "pt-BR"] as const;

export type Locale = (typeof LOCALES)[number];

export const localeOptions: { id: Locale; nativeName: string }[] = [
  { id: "en", nativeName: "English" },
  { id: "pt-BR", nativeName: "Português (Brasil)" },
];

export const chromeCopy: Record<
  Locale,
  {
    wordmark: string;
    footer: string;
    language: string;
    signOut: string;
    loading: string;
    admin: string;
    studyMap: string;
  }
> = {
  en: {
    wordmark: "ApexFun",
    footer:
      "ApexFun is not affiliated with, endorsed by, or sponsored by Salesforce, Inc. Salesforce and Apex are trademarks of Salesforce, Inc.",
    language: "Language",
    signOut: "Sign out",
    loading: "Loading…",
    admin: "Admin",
    studyMap: "Student map",
  },
  "pt-BR": {
    wordmark: "ApexFun",
    footer:
      "ApexFun não é afiliado, endossado ou patrocinado pela Salesforce, Inc. Salesforce e Apex são marcas da Salesforce, Inc.",
    language: "Idioma",
    signOut: "Sair",
    loading: "Carregando…",
    admin: "Admin",
    studyMap: "Mapa do aluno",
  },
};
