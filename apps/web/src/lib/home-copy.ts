import type { Locale } from "@/lib/locale";

export const homeCopy: Record<
  Locale,
  {
    eyebrow: string;
    headlineLead: string;
    headlineAccent: string;
    lede: string;
    howTitle: string;
    steps: { title: string; body: string }[];
    previewKicker: string;
    previewTitle: string;
    previewBody: string;
    exampleCheck: string;
    pathTitle: string;
    pathLead: string;
  }
> = {
  en: {
    eyebrow: "Salesforce Apex, for new programmers",
    headlineLead: "Learn Apex",
    headlineAccent: "by writing it.",
    lede: "Read a short card, then type real Apex. The site checks your code. You do not need a Salesforce org.",
    howTitle: "How a lesson works",
    steps: [
      {
        title: "Read",
        body: "A short theory card, in English or Portuguese.",
      },
      {
        title: "Write",
        body: "You type the Apex. The editor starts empty.",
      },
      {
        title: "Check",
        body: "Run it. The next card opens only after this one passes.",
      },
    ],
    previewKicker: "Example",
    previewTitle: "Your first lines",
    previewBody: "A variable is a name for a value.",
    exampleCheck: "Example check: correct",
    pathTitle: "The path",
    pathLead:
      "You start with Variables. Later modules stay locked until they are written.",
  },
  "pt-BR": {
    eyebrow: "Apex da Salesforce, para quem está começando a programar",
    headlineLead: "Aprenda Apex",
    headlineAccent: "escrevendo de verdade.",
    lede: "Leia um card curto e depois digite Apex de verdade. O site confere o código. Você não precisa de uma org da Salesforce.",
    howTitle: "Como uma lição funciona",
    steps: [
      {
        title: "Leia",
        body: "Um card curto de teoria, em português ou inglês.",
      },
      {
        title: "Escreva",
        body: "Você digita o Apex. O editor começa vazio.",
      },
      {
        title: "Confira",
        body: "Rode. O próximo card só abre quando este passa.",
      },
    ],
    previewKicker: "Exemplo",
    previewTitle: "As primeiras linhas",
    previewBody: "Uma variável é um nome para um valor.",
    exampleCheck: "Exemplo de conferência: correto",
    pathTitle: "O caminho",
    pathLead:
      "Você começa por Variáveis. Os módulos seguintes ficam bloqueados até serem escritos.",
  },
};
