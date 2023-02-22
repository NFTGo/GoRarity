import { Token } from './token';
import { TokenRankingFeatures } from './token-ranking-features';

export type TokenRarity = {
  score: number;
  tokenFeatures: TokenRankingFeatures;
  token: Token;
  rank: number;
};
