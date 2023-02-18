import { Collection, Token } from '../../models';
import { IScoringHandler } from '../scoring-handler';
import { round } from '../utils';

const MAX_RARITY_SCORE = 100;

export class JaccardDistanceScoringHandler implements IScoringHandler {
  scoreTokens(collection: Collection, tokens: Token[]): number[] {
    const traitKeys: string[] = [];
    const traitKeyMapTraitKeysIndex = new Map<string, number>();
    const tokenIds: number[] = [];
    const indexesList: number[][] = [];

    for (const token of tokens) {
      const indexes: number[] = [];
      Array.from(token.metadata.stringAttributes.values()).forEach((trait) => {
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
