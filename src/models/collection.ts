import { Token } from './token';
import { AttributeName, AttributeValue, StringAttribute } from './token-metadata';
import { TokenStandard } from './token-standard';
import { normalizeAttributeString } from './utils/attribute-utils';

// export type CollectionAttribute = {
//   attribute: StringAttribute,
//   totalTokens: number,
// }

export class Collection {
  private _name: string;
  private _tokens: Token[];
  private _attributesFrequencyCounts: Map<AttributeName, Map<AttributeValue, number>>;

  constructor(dict: { name: string; tokens: Token[] }) {
    this._name = dict.name;
    this._tokens = dict.tokens;
    this._attributesFrequencyCounts = this.deriveNormalizedAttributesFrequencyCounts();
  }

  // get name() {
  //   return this._name;
  // }

  get tokens() {
    return this._tokens;
  }

  // get tokenTotalSupply() {
  //   return this._tokens.length;
  // }

  tokenStandards(): TokenStandard[] {
    const tokenStandards = new Set<TokenStandard>();
    this._tokens.forEach((token) => {
      tokenStandards.add(token.tokenStandard);
    });
    return Array.from(tokenStandards.values());
  }

  totalTokensWithAttribute(attribute: StringAttribute): number {
    return this._attributesFrequencyCounts.get(attribute.name)?.get(attribute.value) || 0;
  }

  private deriveNormalizedAttributesFrequencyCounts(): Map<AttributeName, Map<AttributeValue, number>> {
    const attributesFrequencyCounts: Map<AttributeName, Map<AttributeValue, number>> = new Map();

    for (const token of this._tokens) {
      Array.from(token.metadata.stringAttributes.entries()).forEach(([attrName, strAttr]) => {
        const normalizedName = normalizeAttributeString(attrName);
        const map = attributesFrequencyCounts.get(normalizedName);
        if (map) {
          const currentCount = map.get(strAttr.value) || 0;
          map.set(strAttr.value, currentCount + 1);
          attributesFrequencyCounts.set(normalizedName, map);
        } else {
          attributesFrequencyCounts.set(normalizedName, new Map<AttributeValue, number>().set(strAttr.value, 1));
        }
      });
    }

    return attributesFrequencyCounts;
  }
}
