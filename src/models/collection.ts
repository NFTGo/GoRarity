import { Token } from "./token";
import { StringAttribute } from "./token-metadata";
import { TokenStandard } from "./token-standard";

export type CollectionAttribute = {
  attribute: StringAttribute,
  totalTokens: number,
}

export class Collection {
  name: string;
  tokens: Token[];

  constructor(dict: { name: string, tokens: Token[] }) {
    this.name = dict.name;
    this.tokens = dict.tokens;
  }

  tokenStandards(): TokenStandard[] {
    const tokenStandards = new Set<TokenStandard>();
    this.tokens.forEach(item => {
      tokenStandards.add(item.tokenStandard);
    })
    return Array.from(tokenStandards.values())
  }
}
