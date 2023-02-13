import { Collection, Token, TokenStandard } from "../models";
import { JaccardDistanceScoringHandler } from "./handlers";
import { IScoringHandler } from "./scoring-handler";

export class Scorer {

  private handler: IScoringHandler;

  constructor() {
    this.handler = new JaccardDistanceScoringHandler();
  }

  validateCollection(collection: Collection) {
    const allowedStandards = [TokenStandard.ERC721, TokenStandard.ERC1155];

    // TODO validate collection with the rules
    //
    collection.tokenStandards().every(val => allowedStandards.includes(val))
  }

  scoreTokens(collection: Collection, tokens: Token[]): number[] {

    this.validateCollection(collection);
    return this.handler.scoreTokens(collection, tokens);
  }
}
