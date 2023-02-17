import { Collection, Token, TokenStandard } from "../models";
import { JaccardDistanceScoringHandler } from "./handlers";
import { IScoringHandler } from "./scoring-handler";

export class Scorer {

  private handler: IScoringHandler;

  constructor() {
    this.handler = new JaccardDistanceScoringHandler();
  }

  validateCollection(collection: Collection) {
    const allowedStandards = [TokenStandard.ERC721];
    if (!collection.tokenStandards().every(val => allowedStandards.includes(val))) {
      throw new Error(`GoRarity currently only supports ERC721 standards`);
    };
  }

  scoreTokens(collection: Collection, tokens: Token[]): number[] {
    this.validateCollection(collection);
    return this.handler.scoreTokens(collection, tokens);
  }

  scoreCollection(collection: Collection): number[] {
    this.validateCollection(collection);
    return this.handler.scoreTokens(collection, collection.tokens);
  }
}
