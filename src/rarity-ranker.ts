/* eslint-disable @typescript-eslint/no-empty-function */
import { Collection, TokenRarity } from './models';
import { Scorer } from './scoring';
import { TokenFeatureExtractor } from './scoring/token-feature-extractor';

export class RarityRanker {
  private static defaultScorer = new Scorer();

  constructor() {}

  /**
   * @description Ranks tokens in the collection with the default scorer implementation.
   * @param collection
   * @param scorer
   * @returns Array of TokenRarity objects with score, rank and token information sorted by rank.
   */
  static rankCollection(collection: Collection, scorer: Scorer = RarityRanker.defaultScorer): TokenRarity[] {
    if (!collection || !collection.tokens || collection.tokens.length === 0) return [];

    const tokens = collection.tokens;
    const scores = scorer.scoreTokens(collection, tokens);
    if (scores.length !== tokens.length) {
      throw new Error(`dimension of scores doesn't match dimension of tokens`);
    }

    const tokenRarities: TokenRarity[] = [];

    for (let idx = 0; idx < tokens.length; idx++) {
      const tokenFeatures = TokenFeatureExtractor.extractUniqueTraitCount(collection, tokens[idx]);
      tokenRarities.push({
        token: tokens[idx],
        score: scores[idx],
        tokenFeatures: tokenFeatures,
        rank: 0, // Prefill
      });
    }

    return RarityRanker.setRarityRanks(tokenRarities);
  }

  /**
   * @description Set the ranking of token according to it's rarity socre.
   * @param tokenRarities Unordered array of tokens with rarity score information
   * @returns Ordered array of tokens sorted by score descending
   */
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
