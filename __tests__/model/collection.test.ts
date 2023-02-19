import { Collection, StringTrait, Token, TokenMetadata, TokenStandard } from '../../src';
import { createEvmToken } from '../utils/utils';

describe('Collection', () => {
  const evmToken = createEvmToken(1, TokenMetadata.fromTokenTraits([{ traitType: 'hat', traitValue: 'cap' }]));

  const tokensWithTraits: Token[] = (() => {
    const tokens: Token[] = [];
    for (let i = 0; i < 100; i++) {
      tokens.push(
        createEvmToken(
          i,
          TokenMetadata.fromTokenTraits(
            (() => {
              return i < 80
                ? [
                    { traitType: 'hat', traitValue: i < 20 ? 'blue' : 'red' },
                    { traitType: 'pants', traitValue: i < 10 ? 'jeans' : 'sweats' },
                  ]
                : [];
            })()
          )
        )
      );
    }
    return tokens;
  })();

  const testCollectionTraits = new Collection(tokensWithTraits, 'collection with traits mix');

  const tokensNoTraits: Token[] = (() => {
    const tokens: Token[] = [];
    for (let i = 0; i < 100; i++) {
      tokens.push(createEvmToken(i));
    }
    return tokens;
  })();

  const testCollectionNoTraits = new Collection(tokensNoTraits, 'collection with tokens but no traits');

  test('test_tokens', () => {
    const collectionOneToken = new Collection([evmToken]);
    expect(testCollectionTraits.tokens).toStrictEqual(tokensWithTraits);
    expect(testCollectionNoTraits.tokens).toStrictEqual(tokensNoTraits);
    expect(collectionOneToken.tokens).toStrictEqual([evmToken]);

    expect(testCollectionTraits.tokenTotalSupply).toBe(100);
    expect(testCollectionNoTraits.tokenTotalSupply).toBe(100);
    expect(collectionOneToken.tokenTotalSupply).toBe(1);

    expect(collectionOneToken.traitsFrequencyCounts).toStrictEqual(new Map().set('hat', new Map().set('cap', 1)));
    expect(testCollectionNoTraits.traitsFrequencyCounts).toStrictEqual(new Map());
    expect(testCollectionTraits.traitsFrequencyCounts).toStrictEqual(
      new Map()
        .set('hat', new Map().set('blue', 20).set('red', 60))
        .set('pants', new Map().set('jeans', 10).set('sweats', 70))
    );
  });

  test('test_extract_null_traits', () => {
    expect(testCollectionTraits.extractNullTraits()).toStrictEqual(
      new Map()
        .set('hat', { trait: new StringTrait('hat', 'Null'), totalTokens: 20 })
        .set('pants', { trait: new StringTrait('pants', 'Null'), totalTokens: 20 })
    );
  });

  test('test_extract_null_traits_empty', () => {
    const collection = new Collection(tokensWithTraits.slice(0, 80));
    expect(collection.extractNullTraits()).toStrictEqual(new Map());
    expect(testCollectionNoTraits.extractNullTraits()).toStrictEqual(new Map());
  });

  test('test_extract_collection_traits', () => {
    expect(testCollectionTraits.extractCollectionTraits()).toStrictEqual(
      new Map()
        .set('hat', [
          { trait: new StringTrait('hat', 'blue'), totalTokens: 20 },
          { trait: new StringTrait('hat', 'red'), totalTokens: 60 },
        ])
        .set('pants', [
          { trait: new StringTrait('pants', 'jeans'), totalTokens: 10 },
          { trait: new StringTrait('pants', 'sweats'), totalTokens: 70 },
        ])
    );
  });

  test('test_extract_empty_collection_traits', () => {
    expect(testCollectionNoTraits.extractCollectionTraits()).toStrictEqual(new Map());
  });

  test('test_collection_init', () => {
    const collection = new Collection(
      (() => {
        const tokens: Token[] = [];
        tokens.push(
          createEvmToken(
            1,
            TokenMetadata.fromTokenTraits([
              { traitType: 'hat', traitValue: 'cap' },
              { traitType: 'bottom', traitValue: 'jeans' },
              { traitType: 'something another', traitValue: 'special' },
            ])
          ),
          createEvmToken(
            2,
            TokenMetadata.fromTokenTraits([
              { traitType: 'hat', traitValue: 'cap' },
              { traitType: 'bottom', traitValue: 'pjs' },
              { traitType: 'something another', traitValue: 'not special' },
            ])
          ),
          createEvmToken(
            3,
            TokenMetadata.fromTokenTraits([
              { traitType: 'hat', traitValue: 'bucket hat' },
              { traitType: 'new', traitValue: 'very special' },
              { traitType: 'integer trait as string', traitValue: '1' },
            ])
          )
        );
        return tokens;
      })()
    );

    expect(collection.traitsFrequencyCounts).toStrictEqual(
      new Map()
        .set('hat', new Map().set('cap', 2).set('bucket hat', 1))
        .set('bottom', new Map().set('jeans', 1).set('pjs', 1))
        .set('something another', new Map().set('special', 1).set('not special', 1))
        .set('new', new Map().set('very special', 1))
        .set('integer trait as string', new Map().set('1', 1))
    );
  });

  test('test_init_trait_count_diff_name_exists', () => {
    const collection = new Collection(
      (() => {
        const tokens: Token[] = [];
        tokens.push(
          createEvmToken(
            1,
            TokenMetadata.fromTokenTraits([
              { traitType: 'hat', traitValue: 'cap' },
              { traitType: 'bottom', traitValue: 'jeans' },
              { traitType: 'something another', traitValue: 'special' },
              { traitType: 'TRAIT_COUNT', traitValue: '3' },
            ])
          ),
          createEvmToken(
            2,
            TokenMetadata.fromTokenTraits([
              { traitType: 'hat', traitValue: 'cap' },
              { traitType: 'something another', traitValue: 'not special' },
              { traitType: 'TRAIT_COUNT', traitValue: '2' },
            ])
          ),
          createEvmToken(
            3,
            TokenMetadata.fromTokenTraits([
              { traitType: 'hat', traitValue: 'bucket hat' },
              { traitType: 'new', traitValue: 'very special' },
              { traitType: 'integer trait as string', traitValue: '1' },
              { traitType: 'four', traitValue: 'four value' },
              { traitType: 'TRAIT_COUNT', traitValue: '4' },
            ])
          ),
          createEvmToken(
            4,
            TokenMetadata.fromTokenTraits([
              { traitType: 'hat', traitValue: 'bucket hat' },
              { traitType: 'new', traitValue: 'very special' },
              { traitType: 'integer trait as string', traitValue: '1' },
              { traitType: 'four', traitValue: 'four value' },
              { traitType: 'TRAIT_COUNT', traitValue: '4' },
            ])
          )
        );
        return tokens;
      })()
    );

    expect(collection.traitsFrequencyCounts).toStrictEqual(
      new Map()
        .set('hat', new Map().set('cap', 2).set('bucket hat', 2))
        .set('bottom', new Map().set('jeans', 1))
        .set('something another', new Map().set('special', 1).set('not special', 1))
        .set('new', new Map().set('very special', 2))
        .set('integer trait as string', new Map().set('1', 2))
        .set('four', new Map().set('four value', 2))
        .set('trait_count', new Map().set('3', 1).set('2', 1).set('4', 2))
    );
  });

  test('test_token_standards', () => {
    expect(testCollectionTraits.tokenStandards()).toStrictEqual([TokenStandard.ERC721]);
    expect(testCollectionNoTraits.tokenStandards()).toStrictEqual([TokenStandard.ERC721]);
  });
});
