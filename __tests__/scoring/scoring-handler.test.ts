import { Collection } from '../../src';
import { JaccardDistanceScoringHandler } from '../../src/scoring/handlers';
import { generateCollectionWithTokensTraits } from '../utils/utils';

describe('JaccardDistanceScoringHandler', () => {
  test('test_jaccard_distance_empty_token', () => {
    const collection = new Collection([]);
    const handler = new JaccardDistanceScoringHandler();

    const scores = handler.scoreTokens(collection, collection.tokens);

    expect(scores).toStrictEqual([]);
  });

  test('test_jaccard_distance_one_token', () => {
    const collection = generateCollectionWithTokensTraits([[{ traitType: 'trait1', traitValue: 'value1' }]]);
    const handler = new JaccardDistanceScoringHandler();

    const scores = handler.scoreTokens(collection, collection.tokens);

    expect(scores).toStrictEqual([0]);
  });

  test('test_jaccard_distance_unique_scores', () => {
    const collection = generateCollectionWithTokensTraits([
      // Token 0
      [
        { traitType: 'trait1', traitValue: 'value1' },
        { traitType: 'trait2', traitValue: 'value1' }, // unique trait
        { traitType: 'trait3', traitValue: 'value2' },
      ],
      // Token 1
      [
        { traitType: 'trait1', traitValue: 'value1' },
        { traitType: 'trait2', traitValue: 'value2' },
        { traitType: 'trait3', traitValue: 'value2' },
      ],
      // Token 2
      [
        { traitType: 'trait1', traitValue: 'value1' },
        { traitType: 'trait2', traitValue: 'value2' },
        { traitType: 'trait3', traitValue: 'value3' }, // unique trait
      ],
      // Token 3
      [
        { traitType: 'trait1', traitValue: 'value1' },
        { traitType: 'trait2', traitValue: 'value4' }, // unique trait
        { traitType: 'trait3', traitValue: 'value2' },
        { traitType: 'trait4', traitValue: 'value1' }, // unique trait
      ],
    ]);
    const handler = new JaccardDistanceScoringHandler();

    const scores = handler.scoreTokens(collection, collection.tokens);

    expect(scores).toStrictEqual([56.25, 0, 100, 81.25]);
  });

  test('test_jaccard_distance_same_scores', () => {
    const collection = generateCollectionWithTokensTraits([
      // Token 0
      [
        { traitType: 'trait1', traitValue: 'value1' },
        { traitType: 'trait2', traitValue: 'value1' },
        { traitType: 'trait3', traitValue: 'value1' },
      ],
      // Token 1 same as Token 0
      [
        { traitType: 'trait1', traitValue: 'value1' },
        { traitType: 'trait2', traitValue: 'value1' },
        { traitType: 'trait3', traitValue: 'value1' },
      ],
      // Token 2
      [
        { traitType: 'trait1', traitValue: 'value2' },
        { traitType: 'trait2', traitValue: 'value1' },
        { traitType: 'trait3', traitValue: 'value3' },
      ],
      // Token 3
      [
        { traitType: 'trait1', traitValue: 'value2' },
        { traitType: 'trait2', traitValue: 'value2' }, // unique trait
        { traitType: 'trait3', traitValue: 'value3' },
      ],
      // Token 4
      [
        { traitType: 'trait1', traitValue: 'value3' }, // unique trait
        { traitType: 'trait2', traitValue: 'value3' }, // unique trait
        { traitType: 'trait3', traitValue: 'value3' },
      ],
    ]);
    const handler = new JaccardDistanceScoringHandler();

    const scores = handler.scoreTokens(collection, collection.tokens);

    expect(scores).toStrictEqual([0, 0, 12.5, 62.5, 100]);
  });
});
