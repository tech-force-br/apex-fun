import type { Locale } from "@/lib/locale";

export const homeCopy: Record<
  Locale,
  {
    eyebrow: string;
    headlineLead: string;
    headlineAccent: string;
    lede: string;
  }
> = {
  en: {
    eyebrow: "Salesforce Apex, for beginner devs",
    headlineLead: "Learn Apex",
    headlineAccent: "fundamentals.",
    lede: "Complete exercises that compile real Apex code without needing a Salesforce org.",
  },
  "pt-BR": {
    eyebrow: "Salesforce Apex, para devs iniciantes",
    headlineLead: "Aprenda os fundamentos",
    headlineAccent: "de Apex.",
    lede: "Faça exercícios que compilam código Apex de verdade, sem a necessidade de criar uma org.",
  },
};
