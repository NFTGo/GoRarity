import { Collection, Token } from "../models";
import { TokenRankingFeatures } from "../models/token-ranking-features";

export class TokenFeatureExtractor {
  static extractUniqueAttributeCount(collection: Collection, token: Token): TokenRankingFeatures {

    let uniqueAttributesCount: number = 0;

    const traits = Array.from(token.metadata.stringAttributes.values());
    for (const trait of traits) {
      const count = collection.totalTokensWithAttribute(trait);
      if (count === 1) {
        uniqueAttributesCount += 1;
      }
    };

    return { uniqueAttributeCount: uniqueAttributesCount }
  }
}
