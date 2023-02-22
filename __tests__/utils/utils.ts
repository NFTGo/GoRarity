import { Collection, EVMContractTokenIdentifier, Token, TokenMetadata, TokenStandard } from '../../src';
import { TraitType, TraitValue } from '../../src/models/token-metadata';

export async function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

export function generateCollectionWithTokensTraits(
  tokensTraits: { traitType: TraitType; traitValue: TraitValue }[][]
): Collection {
  const tokens: Token[] = [];

  for (let idx = 0; idx < tokensTraits.length; idx++) {
    const identifierType = new EVMContractTokenIdentifier('0x0', idx);
    const tokenStandard = TokenStandard.ERC721;
    tokens.push(new Token(identifierType, tokenStandard, TokenMetadata.fromTokenTraits(tokensTraits[idx])));
  }

  return new Collection(tokens, 'My Collection');
}

export function createEvmToken(
  tokenId: number,
  metadata?: TokenMetadata,
  contractAddress = '0xaaa',
  tokenStandard: TokenStandard = TokenStandard.ERC721
) {
  if (!metadata) metadata = new TokenMetadata();
  return new Token(new EVMContractTokenIdentifier(contractAddress, tokenId), tokenStandard, metadata);
}

export function generateMixedCollection(maxTotalSupply = 10000) {
  if (maxTotalSupply % 10 !== 0 || maxTotalSupply < 100) {
    throw new Error(`only multiples of 10 and greater than 100 please.`);
  }
}
