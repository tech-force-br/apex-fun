export const LOCALES = ["en", "pt-BR"] as const;

export type Locale = (typeof LOCALES)[number];

export const localeOptions: { id: Locale; nativeName: string }[] = [
  { id: "en", nativeName: "English" },
  { id: "pt-BR", nativeName: "Português (Brasil)" },
];

export const chromeCopy: Record<
  Locale,
  {
    footer: string;
    language: string;
  }
> = {
  en: {
    footer:
      "ApexFun is not affiliated with, endorsed by, or sponsored by Salesforce, Inc. Salesforce and Apex are trademarks of Salesforce, Inc.",
    language: "Language",
  },
  "pt-BR": {
    footer:
      "ApexFun não é afiliado, endossado ou patrocinado pela Salesforce, Inc. Salesforce e Apex são marcas da Salesforce, Inc.",
    language: "Idioma",
  },
};
