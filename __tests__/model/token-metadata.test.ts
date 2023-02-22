import { StringTrait, TokenMetadata } from '../../src';

describe('TokenMetadata', () => {
  const testTokenMetadata = new TokenMetadata(new Map().set('hat', new StringTrait('hat', 'blue cap')));

  test('test_from_traits', () => {
    const tokenMetadata = TokenMetadata.fromTokenTraits([
      { traitType: 'hat', traitValue: 'blue cap' },
      { traitType: 'PANTS', traitValue: 'jeans' },
    ]);

    expect(tokenMetadata.stringTraits).toStrictEqual(
      new Map().set('hat', new StringTrait('hat', 'blue cap')).set('pants', new StringTrait('pants', 'jeans'))
    );
  });

  test('test_attribute_exists', () => {
    expect(testTokenMetadata.traitExists('hat')).toEqual(true);
    expect(testTokenMetadata.traitExists('HAT')).toEqual(true);
    expect(testTokenMetadata.traitExists('   hat   ')).toEqual(true);
    expect(testTokenMetadata.traitExists('scarf')).toEqual(false);
    expect(new TokenMetadata().traitExists('hat')).toEqual(false);
  });

  test('test_add_attribute_empty', () => {
    const tokenMetadata = new TokenMetadata();
    tokenMetadata.addTrait(new StringTrait('hat', 'blue cap'));
    tokenMetadata.addTrait(new StringTrait('integer trait as string', '1'));
    expect(tokenMetadata.stringTraits).toStrictEqual(
      new Map()
        .set('hat', new StringTrait('hat', 'blue cap'))
        .set('integer trait as string', new StringTrait('integer trait as string', '1'))
    );
  });

  test('test_add_attribute_non_empty', () => {
    const tokenMetadata = TokenMetadata.fromTokenTraits([
      { traitType: 'hat', traitValue: 'blue cap' },
      { traitType: 'PANTS', traitValue: 'jeans' },
    ]);

    tokenMetadata.addTrait(new StringTrait('scarf', 'old'));
    tokenMetadata.addTrait(new StringTrait('scarf', 'wrap-around'));

    expect(tokenMetadata.stringTraits).toStrictEqual(
      new Map()
        .set('hat', new StringTrait('hat', 'blue cap'))
        .set('pants', new StringTrait('pants', 'jeans'))
        .set('scarf', new StringTrait('scarf', 'wrap-around'))
    );
  });

  test('test_metadata_to_attributes', () => {
    expect(testTokenMetadata.toTraits()).toStrictEqual(new Map().set('hat', 'blue cap'));
  });
});
