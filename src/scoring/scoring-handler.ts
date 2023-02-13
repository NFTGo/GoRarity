import { Collection, Token } from "../models";

export interface IScoringHandler {
  scoreTokens(collection: Collection, tokens: Token[]): number[],
}
