import { Collection, Token } from "../../models";
import { IScoringHandler } from "../scoring-handler";

export class JaccardDistanceScoringHandler implements IScoringHandler {

  scoreTokens(collection: Collection, tokens: Token[]): number[] {
    return [];
  }
}
