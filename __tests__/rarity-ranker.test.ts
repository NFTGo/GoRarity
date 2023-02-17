import { EVMContractTokenIdentifier, Token, TokenRarity, TokenStandard } from "../src/models";
import { RarityRanker } from "../src/rarity-ranker";
import { Scorer } from "../src/scoring";
import { generateCollectionWithTokensTraits } from "./utils/utils";

function verifyTokenRarities(
  tokenRarities: TokenRarity[],
  expectedData: { id: number, rank: number, uniqueTraits: number, score?: number }[],
) {
  expect(tokenRarities.length).toBe(expectedData.length);
  for (let idx = 0; idx < tokenRarities.length; idx++) {
    expect(tokenRarities[idx].rank).toBe(expectedData[idx].rank);
    expect(tokenRarities[idx].token.tokenIdentifier.tokenId).toBe(expectedData[idx].id);
    expect(tokenRarities[idx].tokenFeatures.uniqueAttributeCount).toBe(expectedData[idx].uniqueTraits);
    if (expectedData[idx].score !== undefined) {
      expect(tokenRarities[idx].score).toBe(expectedData[idx].score);
    }
  };
}

describe("RarityRanker", () => {
  test("test_rarity_ranker_empty_collection", () => {
    const tokenRarities = RarityRanker.rankCollection(null as any);
    expect(tokenRarities).toEqual([]);
  });

  test("test_rarity_ranker_one_item", () => {
    const testCollection = generateCollectionWithTokensTraits([
      // only one token
      [
        { traitType: "trait1", traitValue: "value1" }
      ]
    ]);
    const tokenRarities = RarityRanker.rankCollection(testCollection);

    expect(tokenRarities[0].score).toBe(0);
    expect(tokenRarities[0].rank).toBe(1);
  });

  test("test_rarity_ranker_equal_score_and_unique_trait", () => {
    const testCollection = generateCollectionWithTokensTraits([
      // Token 0
      [
        { traitType: "trait1", traitValue: "value1" },
        { traitType: "trait2", traitValue: "value1" }, // unique trait
        { traitType: "trait3", traitValue: "value2" },
      ],
      // Token 1
      [
        { traitType: "trait1", traitValue: "value1" },
        { traitType: "trait2", traitValue: "value2" },
        { traitType: "trait3", traitValue: "value2" },
      ],
      // Token 2
      [
        { traitType: "trait1", traitValue: "value1" },
        { traitType: "trait2", traitValue: "value2" },
        { traitType: "trait3", traitValue: "value3" }, // unique trait
      ],
      // Token 3
      [
        { traitType: "trait1", traitValue: "value1" },
        { traitType: "trait2", traitValue: "value2" },
        { traitType: "trait3", traitValue: "value2" },
        { traitType: "trait4", traitValue: "value1" }, // unique trait
      ]
    ]);

    const expectedTokensInRankOrder = [
      { id: 0, rank: 1, uniqueTraits: 1 },
      { id: 2, rank: 1, uniqueTraits: 1 },
      { id: 3, rank: 3, uniqueTraits: 1 },
      { id: 1, rank: 4, uniqueTraits: 0 },
    ]
    const tokenRarities = RarityRanker.rankCollection(testCollection);
    verifyTokenRarities(tokenRarities, expectedTokensInRankOrder);
  });

  test("test_rarity_ranker_unique_scores", () => {
    const testCollection = generateCollectionWithTokensTraits([
      // Token 0
      [
        { traitType: "trait1", traitValue: "value1" },
        { traitType: "trait2", traitValue: "value1" }, // unique trait
        { traitType: "trait3", traitValue: "value2" },
      ],
      // Token 1
      [
        { traitType: "trait1", traitValue: "value1" },
        { traitType: "trait2", traitValue: "value2" },
        { traitType: "trait3", traitValue: "value2" },
      ],
      // Token 2
      [
        { traitType: "trait1", traitValue: "value1" },
        { traitType: "trait2", traitValue: "value2" },
        { traitType: "trait3", traitValue: "value3" }, // unique trait
      ],
      // Token 3
      [
        { traitType: "trait1", traitValue: "value1" },
        { traitType: "trait2", traitValue: "value4" }, // unique trait
        { traitType: "trait3", traitValue: "value2" },
        { traitType: "trait4", traitValue: "value1" }, // unique trait
      ]
    ]);

    const tokenRarities = RarityRanker.rankCollection(testCollection);
    const scorer = new Scorer();
    const expectedscores = scorer.scoreCollection(testCollection);
    const expectedTokensInRankOrder = [
      { id: 2, rank: 1, uniqueTraits: 1, score: expectedscores[2] },
      { id: 3, rank: 2, uniqueTraits: 2, score: expectedscores[3] },
      { id: 0, rank: 3, uniqueTraits: 1, score: expectedscores[0] },
      { id: 1, rank: 4, uniqueTraits: 0, score: expectedscores[1] },
    ];
    verifyTokenRarities(tokenRarities, expectedTokensInRankOrder);
  });

  test("test_rarity_ranker_same_scores", () => {
    const testCollection = generateCollectionWithTokensTraits([
      // Token 0
      [
        { traitType: "trait1", traitValue: "value1" },
        { traitType: "trait2", traitValue: "value1" },
        { traitType: "trait3", traitValue: "value1" },
      ],
      // Token 1
      [
        { traitType: "trait1", traitValue: "value1" },
        { traitType: "trait2", traitValue: "value1" },
        { traitType: "trait3", traitValue: "value1" },
      ],
      // Token 2
      [
        { traitType: "trait1", traitValue: "value2" },
        { traitType: "trait2", traitValue: "value1" },
        { traitType: "trait3", traitValue: "value3" },
      ],
      // Token 3
      [
        { traitType: "trait1", traitValue: "value2" },
        { traitType: "trait2", traitValue: "value2" },
        { traitType: "trait3", traitValue: "value3" },
      ],
      // Token 4
      [
        { traitType: "trait1", traitValue: "value3" },
        { traitType: "trait2", traitValue: "value3" },
        { traitType: "trait3", traitValue: "value3" },
      ]
    ]);

    const tokenRarities = RarityRanker.rankCollection(testCollection);
    const expectedTokensInRankOrder = [
      { id: 4, rank: 1, uniqueTraits: 2, score: 100 },
      { id: 3, rank: 2, uniqueTraits: 1, score: 62.5 },
      { id: 2, rank: 3, uniqueTraits: 0, score: 12.5 },
      { id: 0, rank: 4, uniqueTraits: 0, score: 0 },
      { id: 1, rank: 4, uniqueTraits: 0, score: 0 },
    ];
    verifyTokenRarities(tokenRarities, expectedTokensInRankOrder);
  });

  test("test_set_ranks_same_unique_different_ic_score", () => {
    const tokenRarities: TokenRarity[] = [];

    tokenRarities.push({
      token: new Token(
        new EVMContractTokenIdentifier("null", 1),
        TokenStandard.ERC721,
        null as any,
      ),
      rank: 0,
      score: 1.5,
      tokenFeatures: { uniqueAttributeCount: 1 }
    });

    tokenRarities.push({
      token: new Token(
        new EVMContractTokenIdentifier("null", 2),
        TokenStandard.ERC721,
        null as any,
      ),
      rank: 0,
      score: 1.5,
      tokenFeatures: { uniqueAttributeCount: 2 }
    });

    tokenRarities.push({
      token: new Token(
        new EVMContractTokenIdentifier("null", 3),
        TokenStandard.ERC721,
        null as any,
      ),
      rank: 0,
      score: 0.2,
      tokenFeatures: { uniqueAttributeCount: 3 }
    });

    tokenRarities.push({
      token: new Token(
        new EVMContractTokenIdentifier("null", 4),
        TokenStandard.ERC721,
        null as any,
      ),
      rank: 0,
      score: 7.0,
      tokenFeatures: { uniqueAttributeCount: 0 }
    });

    const result = RarityRanker.setRarityRanks(tokenRarities);

    expect(result[0].token.tokenIdentifier.tokenId).toBe(4);
    expect(result[0].rank).toBe(1);

    expect(result[1].token.tokenIdentifier.tokenId).toBe(1);
    expect(result[1].rank).toBe(2);

    expect(result[2].token.tokenIdentifier.tokenId).toBe(2);
    expect(result[2].rank).toBe(2);

    expect(result[3].token.tokenIdentifier.tokenId).toBe(3);
    expect(result[3].rank).toBe(4);
  });
})
