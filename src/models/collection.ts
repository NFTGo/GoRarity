import { Token } from './token';
import { StringTrait, TraitType, TraitValue } from './token-metadata';
import { TokenStandard } from './token-standard';
import { normalizeAttributeString } from './utils/attribute-utils';

export type CollectionTrait = {
  trait: StringTrait;
  totalTokens: number;
};

export class Collection {
  private _name: string;
  private _tokens: Token[];
  private _traitsFrequencyCounts: Map<TraitType, Map<TraitValue, number>>;

  constructor(tokens: Token[], name = '') {
    this._name = name;
    this._tokens = tokens;
    this._traitsFrequencyCounts = this.deriveNormalizedTraitsFrequencyCounts();
  }

  get name() {
    return this._name;
  }

  get tokens() {
    return this._tokens;
  }

  get tokenTotalSupply() {
    return this._tokens.length;
  }

  get traitsFrequencyCounts() {
    return this._traitsFrequencyCounts;
  }

  tokenStandards(): TokenStandard[] {
    const tokenStandards = new Set<TokenStandard>();
    this._tokens.forEach((token) => {
      tokenStandards.add(token.tokenStandard);
    });
    return Array.from(tokenStandards.values());
  }

  totalTokensWithTrait(trait: StringTrait): number {
    return this._traitsFrequencyCounts.get(trait.name)?.get(trait.value) || 0;
  }

  extractNullTraits(): Map<TraitType, CollectionTrait> {
    const result = new Map<TraitType, CollectionTrait>();
    Array.from(this._traitsFrequencyCounts.entries()).forEach(([traitName, traitValues]) => {
      let totalTraitCount = 0;
      Array.from(traitValues.values()).forEach((traitCount) => (totalTraitCount += traitCount));
      const assetsWithoutTrait = this.tokenTotalSupply - totalTraitCount;
      if (assetsWithoutTrait > 0) {
        result.set(traitName, { trait: new StringTrait(traitName, 'Null'), totalTokens: assetsWithoutTrait });
      }
    });
    return result;
  }

  extractCollectionTraits(): Map<TraitType, CollectionTrait[]> {
    const result = new Map<TraitType, CollectionTrait[]>();

    Array.from(this._traitsFrequencyCounts.entries()).forEach(([traitName, traitValues]) => {
      Array.from(traitValues.entries()).forEach(([traitValue, traitCount]) => {
        const arr = result.get(traitName);
        if (arr) {
          arr.push({ trait: new StringTrait(traitName, traitValue), totalTokens: traitCount });
          result.set(traitName, arr);
        } else {
          result.set(
            traitName,
            new Array<CollectionTrait>({ trait: new StringTrait(traitName, traitValue), totalTokens: traitCount })
          );
        }
      });
    });

    return result;
  }

  private deriveNormalizedTraitsFrequencyCounts(): Map<TraitType, Map<TraitValue, number>> {
    const traitsFrequencyCounts: Map<TraitType, Map<TraitValue, number>> = new Map();

    for (const token of this._tokens) {
      Array.from(token.metadata.stringTraits.entries()).forEach(([traitName, strTrait]) => {
        const normalizedName = normalizeAttributeString(traitName);
        const map = traitsFrequencyCounts.get(normalizedName);
        if (map) {
          const currentCount = map.get(strTrait.value) || 0;
          map.set(strTrait.value, currentCount + 1);
          traitsFrequencyCounts.set(normalizedName, map);
        } else {
          traitsFrequencyCounts.set(normalizedName, new Map<TraitValue, number>().set(strTrait.value, 1));
        }
      });
    }

    return traitsFrequencyCounts;
  }
}
