import type { Locale } from "@/lib/locale";
import type { SaveIssue } from "@/lib/curriculum-store";

export const adminCopy: Record<
  Locale,
  {
    title: string;
    intro: string;
    memoryNote: string;
    saved: string;
    save: string;
    remove: string;
    discardConfirm: string;
    removeConfirm: string;
    addModule: string;
    addTopic: string;
    addTheory: string;
    addExercise: string;
    newModule: string;
    newTopic: string;
    newTheory: string;
    newExercise: string;
    modules: string;
    topics: string;
    cards: string;
    emptyModules: string;
    emptyTopics: string;
    emptyCards: string;
    pickItem: string;
    nameEn: string;
    namePt: string;
    status: string;
    statusOpen: string;
    statusLater: string;
    topicKind: string;
    kindTheory: string;
    kindExercises: string;
    bodyEn: string;
    bodyPt: string;
    sampleApex: string;
    sampleApexHelp: string;
    imageRefs: string;
    imageUrl: string;
    addImage: string;
    promptEn: string;
    promptPt: string;
    hiddenTests: string;
    addTest: string;
    testN: (n: number) => string;
    testMode: string;
    modeRunClean: string;
    modeCompileFail: string;
    checkApex: string;
    checkApexHelp: string;
    compileMatch: string;
    compileMatchHelp: string;
    testMessageEn: string;
    testMessagePt: string;
    preview: string;
    previewHelp: string;
    previewCode: string;
    previewRun: string;
    previewIdle: string;
    previewUnavailable: string;
    moveUp: string;
    moveDown: string;
    theoryBadge: string;
    exerciseBadge: string;
    issue: (issue: SaveIssue) => string;
  }
> = {
  en: {
    title: "Content admin",
    intro: "Create and edit modules, topic folders, and cards.",
    memoryNote:
      "Saves apply in this tab only. Refresh restores the seed curriculum.",
    saved: "Saved in this tab.",
    save: "Save",
    remove: "Remove",
    discardConfirm: "Discard unsaved changes?",
    removeConfirm: "Remove this item from the tab?",
    addModule: "Add module",
    addTopic: "Add topic",
    addTheory: "Add theory card",
    addExercise: "Add exercise card",
    newModule: "New module",
    newTopic: "New topic",
    newTheory: "New theory card",
    newExercise: "New exercise card",
    modules: "Modules",
    topics: "Topics",
    cards: "Cards",
    emptyModules: "No modules yet.",
    emptyTopics: "No topics in this module.",
    emptyCards: "No cards in this topic.",
    pickItem: "Pick an item in the tree, or add a module.",
    nameEn: "Name (English)",
    namePt: "Name (Portuguese)",
    status: "Map status",
    statusOpen: "Open",
    statusLater: "Coming later",
    topicKind: "Student-map label",
    kindTheory: "Theory",
    kindExercises: "Exercises",
    bodyEn: "Theory body (English)",
    bodyPt: "Theory body (Portuguese)",
    sampleApex: "Read-only Apex sample (English)",
    sampleApexHelp: "Optional. Apex stays English.",
    imageRefs: "Image URLs",
    imageUrl: "Image URL",
    addImage: "Add image URL",
    promptEn: "Prompt (English)",
    promptPt: "Prompt (Portuguese)",
    hiddenTests: "Hidden tests",
    addTest: "Add hidden test",
    testN: (n) => `Hidden test ${n}`,
    testMode: "Mode",
    modeRunClean: "Pass if this Apex runs clean",
    modeCompileFail: "Pass if this Apex fails to compile",
    checkApex: "Check Apex (English)",
    checkApexHelp:
      "Small snippet that runs after the student code, in the same scope.",
    compileMatch: "Compile-fail match text",
    compileMatchHelp: "The real Apex error must contain this text.",
    testMessageEn: "Student message (English)",
    testMessagePt: "Student message (Portuguese)",
    preview: "Preview",
    previewHelp: "Paste sample student code. Live run against aer is not wired yet.",
    previewCode: "Sample student code",
    previewRun: "Run preview",
    previewIdle: "No preview run yet.",
    previewUnavailable:
      "Runner is not connected yet. Preview will call aer when that slice lands.",
    moveUp: "Move up",
    moveDown: "Move down",
    theoryBadge: "Theory",
    exerciseBadge: "Exercise",
    issue: (issue) => {
      const n = (issue.testIndex ?? 0) + 1;
      switch (issue.code) {
        case "name_en":
          return "English name is required.";
        case "name_pt":
          return "Portuguese name is required.";
        case "body_en":
          return "English theory body is required.";
        case "body_pt":
          return "Portuguese theory body is required.";
        case "prompt_en":
          return "English prompt is required.";
        case "prompt_pt":
          return "Portuguese prompt is required.";
        case "need_hidden_test":
          return "Add at least one hidden test.";
        case "test_check":
          return `Hidden test ${n}: check Apex is required.`;
        case "test_match":
          return `Hidden test ${n}: compile-fail match text is required.`;
        case "test_message_en":
          return `Hidden test ${n}: English student message is required.`;
        case "test_message_pt":
          return `Hidden test ${n}: Portuguese student message is required.`;
      }
    },
  },
  "pt-BR": {
    title: "Admin de conteúdo",
    intro: "Crie e edite módulos, pastas de tópicos e cards.",
    memoryNote:
      "As alterações valem só nesta aba. Atualizar a página volta o currículo inicial.",
    saved: "Salvo nesta aba.",
    save: "Salvar",
    remove: "Remover",
    discardConfirm: "Descartar alterações não salvas?",
    removeConfirm: "Remover este item desta aba?",
    addModule: "Adicionar módulo",
    addTopic: "Adicionar tópico",
    addTheory: "Adicionar card de teoria",
    addExercise: "Adicionar card de exercício",
    newModule: "Novo módulo",
    newTopic: "Novo tópico",
    newTheory: "Novo card de teoria",
    newExercise: "Novo card de exercício",
    modules: "Módulos",
    topics: "Tópicos",
    cards: "Cards",
    emptyModules: "Ainda não há módulos.",
    emptyTopics: "Este módulo ainda não tem tópicos.",
    emptyCards: "Este tópico ainda não tem cards.",
    pickItem: "Escolha um item na árvore, ou adicione um módulo.",
    nameEn: "Nome (inglês)",
    namePt: "Nome (português)",
    status: "Status no mapa",
    statusOpen: "Aberto",
    statusLater: "Em breve",
    topicKind: "Rótulo no mapa do aluno",
    kindTheory: "Teoria",
    kindExercises: "Exercícios",
    bodyEn: "Corpo da teoria (inglês)",
    bodyPt: "Corpo da teoria (português)",
    sampleApex: "Amostra Apex somente leitura (inglês)",
    sampleApexHelp: "Opcional. Apex permanece em inglês.",
    imageRefs: "URLs de imagens",
    imageUrl: "URL da imagem",
    addImage: "Adicionar URL de imagem",
    promptEn: "Enunciado (inglês)",
    promptPt: "Enunciado (português)",
    hiddenTests: "Testes ocultos",
    addTest: "Adicionar teste oculto",
    testN: (n) => `Teste oculto ${n}`,
    testMode: "Modo",
    modeRunClean: "Passa se este Apex rodar limpo",
    modeCompileFail: "Passa se este Apex falhar na compilação",
    checkApex: "Apex de verificação (inglês)",
    checkApexHelp:
      "Trecho curto que roda depois do código do aluno, no mesmo escopo.",
    compileMatch: "Texto da falha de compilação",
    compileMatchHelp: "O erro real do Apex precisa conter este texto.",
    testMessageEn: "Mensagem ao aluno (inglês)",
    testMessagePt: "Mensagem ao aluno (português)",
    preview: "Prévia",
    previewHelp:
      "Cole um código de exemplo. A execução ao vivo no aer ainda não está ligada.",
    previewCode: "Código de exemplo do aluno",
    previewRun: "Rodar prévia",
    previewIdle: "Nenhuma prévia rodada ainda.",
    previewUnavailable:
      "O runner ainda não está ligado. A prévia vai chamar o aer quando essa fatia existir.",
    moveUp: "Subir",
    moveDown: "Descer",
    theoryBadge: "Teoria",
    exerciseBadge: "Exercício",
    issue: (issue) => {
      const n = (issue.testIndex ?? 0) + 1;
      switch (issue.code) {
        case "name_en":
          return "O nome em inglês é obrigatório.";
        case "name_pt":
          return "O nome em português é obrigatório.";
        case "body_en":
          return "O corpo da teoria em inglês é obrigatório.";
        case "body_pt":
          return "O corpo da teoria em português é obrigatório.";
        case "prompt_en":
          return "O enunciado em inglês é obrigatório.";
        case "prompt_pt":
          return "O enunciado em português é obrigatório.";
        case "need_hidden_test":
          return "Adicione pelo menos um teste oculto.";
        case "test_check":
          return `Teste oculto ${n}: o Apex de verificação é obrigatório.`;
        case "test_match":
          return `Teste oculto ${n}: o texto da falha de compilação é obrigatório.`;
        case "test_message_en":
          return `Teste oculto ${n}: a mensagem em inglês é obrigatória.`;
        case "test_message_pt":
          return `Teste oculto ${n}: a mensagem em português é obrigatória.`;
      }
    },
  },
};
