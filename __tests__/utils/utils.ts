import { Collection, EVMContractTokenIdentifier, Token, TokenMetadata, TokenStandard } from "../../src/models";

export async function sleep(duration: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}

export function generateCollectionWithTokensTraits(tokensTraits: { traitType: string, traitValue: string }[][]): Collection {

  const tokens: Token[] = [];

  for (let idx = 0; idx < tokensTraits.length; idx++) {
    const identifierType = new EVMContractTokenIdentifier("0x0", idx);
    const tokenStandard = TokenStandard.ERC721;
    tokens.push(new Token(identifierType, tokenStandard, TokenMetadata.fromTokenTraits(tokensTraits[idx])))
  };

  return new Collection({ name: "My Collection", tokens: tokens });
}
