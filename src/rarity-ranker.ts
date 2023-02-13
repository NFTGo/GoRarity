import { Collection, TokenRarity } from "./models";
import { Scorer } from "./scoring";

export class RarityRanker {
  private static defaultScorer = new Scorer();

  constructor() { }

  static rankCollection(collection: Collection, score: Scorer = RarityRanker.defaultScorer): TokenRarity[] {
    if (!collection || !collection.tokens || collection.tokens.length === 0) return [];

    const tokens = collection.tokens;
    const scores = score.scoreTokens(collection, tokens);
    if (scores.length !== tokens.length) { throw new Error(`dimension of scores doesn't match dimension of tokens`) }

    const tokenRarities: TokenRarity[] = []

    // TODO

    return RarityRanker.setRarityRanks(tokenRarities);
  }

  static setRarityRanks(tokenRarities: TokenRarity[]): TokenRarity[] {
    return [];
  }
}
