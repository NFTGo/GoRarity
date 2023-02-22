import { Collection, EVMContractTokenIdentifier, Token, TokenMetadata, TokenStandard } from '../../src';
import { Scorer } from '../../src/scoring';

describe('Scorer', () => {
  test('test_invaid_collection', () => {
    const collection = new Collection([
      new Token(new EVMContractTokenIdentifier('0xaaa', 1), TokenStandard.ERC1155, new TokenMetadata()),
    ]);
    const scorer = new Scorer();

    expect(() => scorer.validateCollection(collection)).toThrow('GoRarity currently only supports ERC721 standards');
  });
});
