import { TokenFeatureExtractor } from '../../src/scoring/token-feature-extractor';
import { generateCollectionWithTokensTraits } from '../utils/utils';

describe('TokenFeatureExtractor', () => {
  test('test_token_feature_extractor', () => {
    const testCollection = generateCollectionWithTokensTraits([
      // Token 0
      [
        { traitType: 'bottom', traitValue: '1' },
        { traitType: 'hat', traitValue: '1' },
        { traitType: 'special', traitValue: 'true' },
      ],
      // Token 1
      [
        { traitType: 'bottom', traitValue: '1' },
        { traitType: 'hat', traitValue: '1' },
        { traitType: 'special', traitValue: 'false' },
      ],
      // Token 2
      [
        { traitType: 'bottom', traitValue: '2' },
        { traitType: 'hat', traitValue: '2' },
        { traitType: 'special', traitValue: 'false' },
      ],
      // Token 3
      [
        { traitType: 'bottom', traitValue: '2' },
        { traitType: 'hat', traitValue: '2' },
        { traitType: 'special', traitValue: 'false' },
      ],
      // Token 4
      [
        { traitType: 'bottom', traitValue: '3' },
        { traitType: 'hat', traitValue: '2' },
        { traitType: 'special', traitValue: 'false' },
      ],
      // Token 5
      [
        { traitType: 'bottom', traitValue: '4' },
        { traitType: 'hat', traitValue: '3' },
        { traitType: 'special', traitValue: 'false' },
      ],
    ]);

    expect(
      TokenFeatureExtractor.extractUniqueTraitCount(testCollection, testCollection.tokens[0]).uniqueTraitCount
    ).toBe(1);

    expect(
      TokenFeatureExtractor.extractUniqueTraitCount(testCollection, testCollection.tokens[1]).uniqueTraitCount
    ).toBe(0);

    expect(
      TokenFeatureExtractor.extractUniqueTraitCount(testCollection, testCollection.tokens[2]).uniqueTraitCount
    ).toBe(0);

    expect(
      TokenFeatureExtractor.extractUniqueTraitCount(testCollection, testCollection.tokens[3]).uniqueTraitCount
    ).toBe(0);

    expect(
      TokenFeatureExtractor.extractUniqueTraitCount(testCollection, testCollection.tokens[4]).uniqueTraitCount
    ).toBe(1);

    expect(
      TokenFeatureExtractor.extractUniqueTraitCount(testCollection, testCollection.tokens[5]).uniqueTraitCount
    ).toBe(2);
  });
});
