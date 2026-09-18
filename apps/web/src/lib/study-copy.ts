import type { Locale } from "@/lib/locale";

export const studyCopy: Record<
  Locale,
  {
    wordmark: string;
    title: string;
    intro: string;
    open: string;
    comingLater: string;
    current: string;
    locked: string;
    theory: string;
    exercises: (count: number) => string;
    signOut: string;
    mockNote: string;
    loading: string;
    backToMap: string;
    topicsTitle: string;
    topicsIntro: string;
    folder: string;
    admin: string;
  }
> = {
  en: {
    wordmark: "ApexFun",
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
    signOut: "Sign out",
    mockNote: "Demo only. Progress is not saved yet.",
    loading: "Loading your map…",
    backToMap: "All modules",
    topicsTitle: "Topics",
    topicsIntro: "Current topic is open. Later topics stay locked.",
    folder: "Folder",
    admin: "Admin",
  },
  "pt-BR": {
    wordmark: "ApexFun",
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
    signOut: "Sair",
    mockNote: "Só uma demonstração. O progresso ainda não é salvo.",
    loading: "Carregando seu mapa…",
    backToMap: "Todos os módulos",
    topicsTitle: "Tópicos",
    topicsIntro: "O tópico atual está aberto. Os seguintes ficam bloqueados.",
    folder: "Pasta",
    admin: "Admin",
  },
};
