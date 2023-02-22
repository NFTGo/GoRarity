import { normalizeAttributeString } from './utils/attribute-utils';

export type TraitType = string;
export type TraitValue = string;

export class StringTrait {
  private _name: TraitType;
  private _value: TraitValue;

  constructor(name: TraitType, value: TraitValue) {
    this._name = normalizeAttributeString(name);
    if (typeof value === 'string') {
      this._value = normalizeAttributeString(value);
    } else {
      throw new TypeError(`provide trait value has invalid type: ${typeof value}, must be string.`);
    }
  }

  get name() {
    return this._name;
  }

  set name(name: TraitType) {
    this._name = name;
  }

  get value() {
    return this._value;
  }
}

export class TokenMetadata {
  private _stringTraits: Map<TraitType, StringTrait> = new Map();

  constructor(stringTraits?: Map<TraitType, StringTrait>) {
    if (!stringTraits) return;
    this._stringTraits = TokenMetadata.normalizeTraits<StringTrait>(stringTraits);
  }

  get stringTraits() {
    return this._stringTraits;
  }

  private static normalizeTraits<T extends StringTrait>(traits: Map<TraitType, T>) {
    const normalizedTraits = new Map<TraitType, T>();

    traits.forEach((trait, traitName) => {
      const normalizedTraitName = normalizeAttributeString(traitName);
      if (trait.name !== normalizedTraitName) {
        trait.name = normalizedTraitName;
      }
      normalizedTraits.set(normalizedTraitName, trait);
    });

    return normalizedTraits;
  }

  static fromTokenTraits(tokenTraits: { traitType: TraitType; traitValue: TraitValue }[]): TokenMetadata {
    const stringTraits: Map<TraitType, StringTrait> = new Map();

    for (const trait of tokenTraits) {
      if (typeof trait.traitValue === 'string') {
        stringTraits.set(trait.traitType, new StringTrait(trait.traitType, trait.traitValue));
      } else {
        throw new TypeError(`provide trait value has invalid type: ${typeof trait.traitValue}, must be string.`);
      }
    }

    return new TokenMetadata(stringTraits);
  }

  toTraits(): Map<TraitType, TraitValue> {
    const result = new Map<TraitType, TraitValue>();
    Array.from(this._stringTraits.values()).forEach((trait) => {
      result.set(trait.name, trait.value);
    });
    return result;
  }

  traitExists(traitName: TraitType): boolean {
    const normalizedName = normalizeAttributeString(traitName);
    return Boolean(this._stringTraits.get(normalizedName));
  }

  addTrait(trait: StringTrait) {
    this._stringTraits.set(trait.name, trait);
  }
}
