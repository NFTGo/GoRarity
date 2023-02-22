import { EVMContractTokenIdentifier, StringTrait, Token, TokenMetadata, TokenStandard } from '../../src';
import { createEvmToken } from '../utils/utils';

describe('Token', () => {
  const testMetadata = new TokenMetadata(
    new Map().set('hat', new StringTrait('hat', 'blue')).set('shirt', new StringTrait('shirt', 'red'))
  );
  const testToken = createEvmToken(1, testMetadata);

  test('test_token_metadata', () => {
    expect(testToken.metadata).toStrictEqual(testMetadata);
  });

  test('test_create_erc721', () => {
    const token = new Token(
      new EVMContractTokenIdentifier('0xaaa', 1),
      TokenStandard.ERC721,
      TokenMetadata.fromTokenTraits([
        { traitType: 'hat', traitValue: 'cap' },
        { traitType: 'shirt', traitValue: 'blue' },
      ])
    );

    const tokenEqual = Token.fromErc721('0xaaa', 1, [
      { traitType: 'hat', traitValue: 'cap' },
      { traitType: 'shirt', traitValue: 'blue' },
    ]);

    expect(token).toStrictEqual(tokenEqual);

    const tokenNotEqual = Token.fromErc721('0xccc', 1, [
      { traitType: 'hat', traitValue: 'cap' },
      { traitType: 'shirt', traitValue: 'blue' },
    ]);

    expect(token).not.toStrictEqual(tokenNotEqual);
  });

  test('test_token_init_metadata_non_matching_trait_names', () => {
    const token = createEvmToken(
      1,
      new TokenMetadata(
        new Map().set('hat', new StringTrait('big hat', 'blue')).set('shirt', new StringTrait('shirt', 'red'))
      )
    );

    expect(token.metadata.stringTraits).toStrictEqual(
      new Map().set('hat', new StringTrait('hat', 'blue')).set('shirt', new StringTrait('shirt', 'red'))
    );
  });

  test('test_token_trait_normalization', () => {
    const expectedEqualMetadataTokens: Token[] = (() => {
      const tokens: Token[] = [];
      tokens.push(
        createEvmToken(
          1,
          new TokenMetadata(
            new Map().set('hat ', new StringTrait('hat', 'blue')).set('Shirt ', new StringTrait('shirt', 'red'))
          )
        ),
        createEvmToken(
          2,
          new TokenMetadata(
            new Map().set('hat', new StringTrait('hat', 'blue')).set('Shirt ', new StringTrait(' shirt', 'red'))
          )
        ),
        createEvmToken(
          3,
          new TokenMetadata(
            new Map().set('Hat', new StringTrait(' hat ', 'blue')).set('shirt', new StringTrait('shirt', 'red'))
          )
        ),
        createEvmToken(
          4,
          new TokenMetadata(
            new Map().set('  hat ', new StringTrait(' hat ', 'blue')).set('   shirt', new StringTrait('shirt', 'red'))
          )
        )
      );
      return tokens;
    })();

    expectedEqualMetadataTokens.forEach((item) => {
      expect(item.metadata).toStrictEqual(expectedEqualMetadataTokens[0].metadata);
    });

    const expectedNotEqual: Token[] = (() => {
      const tokens: Token[] = [];
      tokens.push(
        createEvmToken(
          1,
          new TokenMetadata(
            new Map()
              .set(' big hat ', new StringTrait(' hat ', 'blue'))
              .set('   shirt', new StringTrait('shirt', 'red'))
          )
        ),
        createEvmToken(
          2,
          new TokenMetadata(
            new Map()
              .set('   hat ', new StringTrait(' hat ', 'blue'))
              .set(' big  shirt', new StringTrait('  shirt', 'red'))
          )
        )
      );
      return tokens;
    })();

    expectedNotEqual.forEach((item) => {
      expect(item.metadata).not.toStrictEqual(expectedEqualMetadataTokens[0].metadata);
    });
  });

  test('test_has_trait', () => {
    expect(testToken.hasTrait('hat')).toEqual(true);
    expect(testToken.hasTrait('shirt')).toEqual(true);
    expect(testToken.hasTrait('not an trait')).toEqual(false);
  });

  test('test_trait_count', () => {
    expect(testToken.traitCount()).toBe(2);
  });
});
