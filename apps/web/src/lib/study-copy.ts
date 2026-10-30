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
    nextTopic: string;
    sample: string;
    editor: string;
    validate: string;
    validating: string;
    passed: string;
    log: string;
    topicProgress: string;
    topicCards: string;
    done: string;
    notDone: string;
    completed: string;
    modulePassedTitle: string;
    modulePassedBody: string;
    moduleRestartTitle: string;
    moduleRestartBody: string;
    moduleScore: (percent: number, clean: number, total: number) => string;
    moduleList: string;
    share: string;
    home: string;
    restart: string;
    close: string;
  }
> = {
  en: {
    title: "Modules",
    intro:
      "Open a module folder. Later modules stay locked until they ship.",
    open: "Open",
    comingLater: "Coming later",
    current: "Current",
    locked: "Locked",
    theory: "Theory",
    exercises: (count) => exerciseLine(count, "Exercise", "Exercises"),
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
    nextTopic: "Next topic",
    sample: "Sample",
    editor: "Apex editor",
    validate: "Validate",
    validating: "Checking…",
    passed: "Passed.",
    log: "Log",
    topicProgress: "Topic progress",
    topicCards: "Cards in this topic",
    done: "Done",
    notDone: "Not done",
    completed: "Completed",
    modulePassedTitle: "You completed the module!",
    modulePassedBody: "Nice work! Keep going!",
    moduleRestartTitle: "Pass score not met!",
    moduleRestartBody:
      "Your exercise pass score is under 90%. A true exercise pass only counts when you pass on first try. To make sure that you nail the fundamentals, you must redo the entire module again. Don't give up! Students rarely pass on the first try!",
    moduleScore: (percent, clean, total) => `${percent}% · ${clean} of ${total}`,
    moduleList: "Module list",
    share: "Share",
    home: "Home",
    restart: "Restart",
    close: "Close",
  },
  "pt-BR": {
    title: "Módulos",
    intro:
      "Abra uma pasta de módulo. Os módulos seguintes ficam bloqueados até serem lançados.",
    open: "Aberto",
    comingLater: "Em breve",
    current: "Atual",
    locked: "Bloqueado",
    theory: "Teoria",
    exercises: (count) => exerciseLine(count, "exercício", "exercícios"),
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
    nextTopic: "Próximo tópico",
    sample: "Amostra",
    editor: "Editor de Apex",
    validate: "Validar",
    validating: "Verificando…",
    passed: "Passou.",
    log: "Log",
    topicProgress: "Progresso do tópico",
    topicCards: "Cards deste tópico",
    done: "Feito",
    notDone: "Não feito",
    completed: "Concluído",
    modulePassedTitle: "Você concluiu o módulo!",
    modulePassedBody: "Bom trabalho! Continue assim!",
    moduleRestartTitle: "Pontuação mínima não atingida!",
    moduleRestartBody:
      "Sua pontuação no exercício ficou abaixo de 90%. Um aproveitamento satisfatório só é considerado válido quando você é aprovado logo na primeira tentativa. Para garantir que você domine bem os fundamentos, é necessário refazer todo o módulo. Não desista! É raro que os alunos sejam aprovados logo na primeira tentativa!",
    moduleScore: (percent, clean, total) => `${percent}% · ${clean} de ${total}`,
    moduleList: "Lista de módulos",
    share: "Compartilhar",
    home: "Início",
    restart: "Reiniciar",
    close: "Fechar",
  },
};
