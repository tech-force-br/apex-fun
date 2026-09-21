import type { TopicListMeta } from "@/lib/curriculum";
import type { Locale } from "@/lib/locale";

function exerciseLine(count: number, one: string, many: string) {
  return count === 1 ? `1 ${one}` : `${count} ${many}`;
}

export function topicListLine(
  meta: TopicListMeta | undefined,
  copy: { theory: string; exercises: (count: number) => string },
) {
  if (!meta) return undefined;
  if (meta.kind === "theory") return copy.theory;
  const exercises = copy.exercises(meta.count);
  if (meta.kind === "exercises") return exercises;
  return `${copy.theory} + ${exercises}`;
}

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
    nextTopic: (name: string) => string;
    mockNote: string;
    backToMap: string;
    topicsTitle: string;
    topicsIntro: string;
    folder: string;
    exercise: string;
    cardsTitle: string;
    cardsIntro: string;
    cardsIntroDone: string;
    emptyCards: string;
    card: string;
    continue: string;
    sample: string;
    exerciseUnavailable: string;
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
    exercises: (count) => exerciseLine(count, "Exercise", "Exercises"),
    nextTopic: (name) => `Next topic: ${name}`,
    mockNote: "Demo only. Progress is not saved yet.",
    backToMap: "All modules",
    topicsTitle: "Topics",
    topicsIntro: "Open the current topic. Later topics stay locked.",
    folder: "Folder",
    exercise: "Exercise",
    cardsTitle: "Cards",
    cardsIntro: "Open the next card. Later cards stay locked.",
    cardsIntroDone: "You can open every card in this topic.",
    emptyCards: "This topic has no cards yet.",
    card: "Card",
    continue: "Continue",
    sample: "Sample",
    exerciseUnavailable: "Exercises are not in this demo yet.",
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
    exercises: (count) => exerciseLine(count, "exercício", "exercícios"),
    nextTopic: (name) => `Próximo tópico: ${name}`,
    mockNote: "Só uma demonstração. O progresso ainda não é salvo.",
    backToMap: "Todos os módulos",
    topicsTitle: "Tópicos",
    topicsIntro: "Abra o tópico atual. Os seguintes ficam bloqueados.",
    folder: "Pasta",
    exercise: "Exercício",
    cardsTitle: "Cards",
    cardsIntro: "Abra o próximo card. Os seguintes ficam bloqueados.",
    cardsIntroDone: "Você pode abrir todos os cards deste tópico.",
    emptyCards: "Este tópico ainda não tem cards.",
    card: "Card",
    continue: "Continuar",
    sample: "Amostra",
    exerciseUnavailable: "Os exercícios ainda não estão nesta demonstração.",
  },
};
