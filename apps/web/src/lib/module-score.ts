import {
  lastCardFinished,
  type CurriculumModule,
  type LocalizedText,
} from "@/lib/curriculum";

export type TopicFirstTryScore = {
  topicId: string;
  names: LocalizedText;
  total: number;
  clean: number;
  /** Whole percent at or below the exact rate. */
  percent: number;
};

export type ModuleScore = {
  total: number;
  clean: number;
  /** Whole percent at or below the exact rate. A miss stays under 90. */
  percent: number;
  passed: boolean;
  topics: TopicFirstTryScore[];
};

/** Clean first tries required. 90% of the total, rounded up. */
export function modulePassLine(total: number) {
  return Math.ceil(total * 0.9);
}

export function moduleScorePercent(clean: number, total: number) {
  if (total === 0) return 100;
  return Math.floor((clean * 100) / total);
}

export function moduleFirstTryScore(
  clean: number,
  total: number,
): Omit<ModuleScore, "topics"> {
  return {
    total,
    clean,
    percent: moduleScorePercent(clean, total),
    passed: clean >= modulePassLine(total),
  };
}

/** `firstClean` is true when that exercise's first scored Run passed. */
export function countModuleFirstTries(
  module: CurriculumModule,
  firstClean: ReadonlyMap<string, boolean>,
): ModuleScore {
  let total = 0;
  let clean = 0;
  const topics: TopicFirstTryScore[] = [];
  for (const topic of module.topics) {
    let topicTotal = 0;
    let topicClean = 0;
    for (const card of topic.cards) {
      if (card.type !== "exercise") continue;
      topicTotal += 1;
      total += 1;
      if (firstClean.get(card.id) === true) {
        topicClean += 1;
        clean += 1;
      }
    }
    if (topicTotal === 0) continue;
    topics.push({
      topicId: topic.id,
      names: topic.names,
      total: topicTotal,
      clean: topicClean,
      percent: moduleScorePercent(topicClean, topicTotal),
    });
  }
  return { ...moduleFirstTryScore(clean, total), topics };
}

/** The last card is finished and the 90% line passed. Coming-later modules stay incomplete. */
export function moduleIsComplete(
  module: CurriculumModule,
  finished: ReadonlySet<string>,
  firstClean: ReadonlyMap<string, boolean>,
) {
  if (module.status !== "open") return false;
  const last = module.topics[module.topics.length - 1];
  if (!last || !lastCardFinished(last, finished)) return false;
  return countModuleFirstTries(module, firstClean).passed;
}
