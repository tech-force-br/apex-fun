import type { Locale } from "@/lib/locale";

export const studyCopy: Record<
  Locale,
  {
    title: string;
    intro: string;
    open: string;
    comingLater: string;
    current: string;
    locked: string;
    theory: string;
    exercises: (count: number) => string;
    mockNote: string;
    backToMap: string;
    topicsTitle: string;
    topicsIntro: string;
    folder: string;
  }
> = {
  en: {
    title: "Your map",
    intro:
      "Open a module folder. Later modules stay locked until they ship.",
    open: "Open",
    comingLater: "Coming later",
    current: "Current",
    locked: "Locked",
    theory: "Theory",
    exercises: (count) =>
      count === 1 ? "1 exercise" : `${count} exercises`,
    mockNote: "Demo only. Progress is not saved yet.",
    backToMap: "All modules",
    topicsTitle: "Topics",
    topicsIntro: "Current topic is open. Later topics stay locked.",
    folder: "Folder",
  },
  "pt-BR": {
    title: "Seu mapa",
    intro:
      "Abra uma pasta de módulo. Os módulos seguintes ficam bloqueados até serem lançados.",
    open: "Aberto",
    comingLater: "Em breve",
    current: "Atual",
    locked: "Bloqueado",
    theory: "Teoria",
    exercises: (count) =>
      count === 1 ? "1 exercício" : `${count} exercícios`,
    mockNote: "Só uma demonstração. O progresso ainda não é salvo.",
    backToMap: "Todos os módulos",
    topicsTitle: "Tópicos",
    topicsIntro: "O tópico atual está aberto. Os seguintes ficam bloqueados.",
    folder: "Pasta",
  },
};
