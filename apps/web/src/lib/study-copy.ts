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
    open: string;
    comingLater: string;
    locked: string;
    theory: string;
    exercises: (count: number) => string;
    mockNote: string;
    backToMap: string;
    topicsTitle: string;
    folder: string;
    exercise: string;
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
    topicCardsDone: (percent: number) => string;
    moduleTopicsDone: (percent: number) => string;
    completed: string;
    modulePassedTitle: string;
    modulePassedBody: string;
    moduleRestartTitle: string;
    moduleRestartBody: string;
    moduleScore: (percent: number, clean: number, total: number) => string;
    share: string;
    home: string;
    restart: string;
    close: string;
  }
> = {
  en: {
    title: "Modules",
    open: "Open",
    comingLater: "Coming later",
    locked: "Locked",
    theory: "Theory",
    exercises: (count) => exerciseLine(count, "Exercise", "Exercises"),
    mockNote: "Demo only. Progress is not saved yet.",
    backToMap: "All modules",
    topicsTitle: "Topics",
    folder: "Folder",
    exercise: "Exercise",
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
    topicCardsDone: (percent) => `${percent}% of cards done`,
    moduleTopicsDone: (percent) => `${percent}% of topics done`,
    completed: "Completed",
    modulePassedTitle: "You completed the module!",
    modulePassedBody: "Nice work! Keep going!",
    moduleRestartTitle: "Pass score not met!",
    moduleRestartBody:
      "Your exercise pass score is under 90%. A true exercise pass only counts when you pass on first try. To make sure that you nail the fundamentals, you must redo the entire module again. Don't give up! Students rarely pass on the first try!",
    moduleScore: (percent, clean, total) => `${percent}% · ${clean} of ${total}`,
    share: "Share",
    home: "Home",
    restart: "Restart",
    close: "Close",
  },
  "pt-BR": {
    title: "Módulos",
    open: "Aberto",
    comingLater: "Em breve",
    locked: "Bloqueado",
    theory: "Teoria",
    exercises: (count) => exerciseLine(count, "exercício", "exercícios"),
    mockNote: "Só uma demonstração. O progresso ainda não é salvo.",
    backToMap: "Todos os módulos",
    topicsTitle: "Tópicos",
    folder: "Pasta",
    exercise: "Exercício",
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
    topicCardsDone: (percent) => `${percent}% dos cards concluídos`,
    moduleTopicsDone: (percent) => `${percent}% dos tópicos concluídos`,
    completed: "Concluído",
    modulePassedTitle: "Você concluiu o módulo!",
    modulePassedBody: "Bom trabalho! Continue assim!",
    moduleRestartTitle: "Pontuação mínima não atingida!",
    moduleRestartBody:
      "Sua pontuação no exercício ficou abaixo de 90%. Um aproveitamento satisfatório só é considerado válido quando você é aprovado logo na primeira tentativa. Para garantir que você domine bem os fundamentos, é necessário refazer todo o módulo. Não desista! É raro que os alunos sejam aprovados logo na primeira tentativa!",
    moduleScore: (percent, clean, total) => `${percent}% · ${clean} de ${total}`,
    share: "Compartilhar",
    home: "Início",
    restart: "Reiniciar",
    close: "Fechar",
  },
};
