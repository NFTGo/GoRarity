import { Collection, Token } from '../../models';
import { IScoringHandler } from '../scoring-handler';
import { round } from '../utils';

const MAX_RARITY_SCORE = 100;

export class JaccardDistanceScoringHandler implements IScoringHandler {
  /**
   * @description Calculate the score of each token.
   * @param collection
   * @param tokens
   * @returns The scores of each token, which has the same order with tokens.
   */
  scoreTokens(collection: Collection, tokens: Token[]): number[] {
    /**
     * We use traitKeys Array index to represent a unique trait,
     * so we can use the index set to identify which traits a token has.
     */
    const traitKeys: string[] = [];
    const traitKeyMapTraitKeysIndex = new Map<string, number>();
    const tokenIds: number[] = [];
    const indexesList: number[][] = [];

    for (const token of tokens) {
      const indexes: number[] = [];
      Array.from(token.metadata.stringTraits.values()).forEach((trait) => {
        const traitKey = `${trait.name}-${trait.value}`;
        let index = traitKeyMapTraitKeysIndex.get(traitKey);
        if (index === undefined) {
          index = traitKeys.length;
          traitKeyMapTraitKeysIndex.set(traitKey, index);
          traitKeys.push(traitKey);
        }
        indexes.push(index);
      });
      tokenIds.push(token.tokenIdentifier.tokenId);
      indexesList.push(indexes);
    }

    return this.calcScores(tokenIds, indexesList);
  }

  /**
   * @description Calculate the score of each token.
   * The token score is defined as the sum of Jaccard Distance between this token and all other token.
   * @param tokenIds Indicate all tokens using tokenId.
   * @param indexesList Indicate the token traits using indexes, and the indexes list has the same order with tokenIds.
   * @returns The scores of each token, which has the same order with tokenIds.
   */
  private calcScores(tokenIds: number[], indexesList: number[][]): number[] {
    let maxScore = -1;
    let minScore = -1;
    const scores: number[] = [];

    for (let i = 0; i < tokenIds.length; i++) {
      let score = 0;
      for (let j = 0; j < tokenIds.length; j++) {
        const dist = this.calcDistance(indexesList[i], indexesList[j]);
        score += dist;
      }
      if (maxScore === -1 || score > maxScore) maxScore = score;
      if (minScore === -1 || score < minScore) minScore = score;
      scores.push(score);
    }

    return this.normalizeScores(scores, maxScore, minScore);
  }

  /**
   * @description We use the Jaccard Distance as the algorithm for calculating the difference between two sets,
   * you can get more information from here: https://en.wikipedia.org/wiki/Jaccard_index.
   * @param traitsA The traits set of token A.
   * @param traitsB The traits set of token B.
   * @returns Distance. The distance indicate the difference between two sets. The bigger the distance, the more different between two sets.
   */
  private calcDistance(traitsA: string[] | number[], traitsB: string[] | number[]): number {
    if (traitsA.length === 0 && traitsB.length === 0) return 0;
    let intersection = 0;
    for (const a of traitsA) {
      for (const b of traitsB) {
        if (a === b) intersection++;
      }
    }
    const union = traitsA.length + traitsB.length - intersection;
    return (union - intersection) / union;
  }

  private normalizeScores(scores: number[], maxScore: number, minScore: number): number[] {
    const range = maxScore - minScore;
    if (range < 0) throw new Error('negative rarity range');

    const normalizedScores: number[] = [];

    for (let i = 0; i < scores.length; i++) {
      if (range === 0) {
        // Set each element of scores as zero when they are the same
        normalizedScores[i] = 0;
      } else {
        normalizedScores[i] = (MAX_RARITY_SCORE * (scores[i] - minScore)) / range;
        normalizedScores[i] = round(normalizedScores[i], 2);
      }
    }

    return normalizedScores;
  }
}
