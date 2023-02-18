/* eslint-disable @typescript-eslint/no-empty-function */
import { Collection, TokenRarity } from './models';
import { Scorer } from './scoring';
import { TokenFeatureExtractor } from './scoring/token-feature-extractor';

export class RarityRanker {
  private static defaultScorer = new Scorer();

  constructor() {}

  static rankCollection(collection: Collection, score: Scorer = RarityRanker.defaultScorer): TokenRarity[] {
    if (!collection || !collection.tokens || collection.tokens.length === 0) return [];

    const tokens = collection.tokens;
    const scores = score.scoreTokens(collection, tokens);
    if (scores.length !== tokens.length) {
      throw new Error(`dimension of scores doesn't match dimension of tokens`);
    }

    const tokenRarities: TokenRarity[] = [];

    for (let idx = 0; idx < tokens.length; idx++) {
      const tokenFeatures = TokenFeatureExtractor.extractUniqueAttributeCount(collection, tokens[idx]);
      tokenRarities.push({
        token: tokens[idx],
        score: scores[idx],
        tokenFeatures: tokenFeatures,
        rank: 0, // Prefill
      });
    }

    return RarityRanker.setRarityRanks(tokenRarities);
  }

  static setRarityRanks(tokenRarities: TokenRarity[]): TokenRarity[] {
    tokenRarities.sort((a, b) => b.score - a.score);

    let rank = 0;
    let preScore = -1;
    let i = 0;
    for (const tokenRarity of tokenRarities) {
      if (tokenRarity.score !== preScore) {
        rank = i + 1;
        preScore = tokenRarity.score;
      }
      tokenRarity.rank = rank;
      i++;
    }

    return tokenRarities;
  }
}
