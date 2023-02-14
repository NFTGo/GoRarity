import { normalizeAttributeString } from "./utils/attribute-utils";

export type AttributeName = string;
export type AttributeValue = string;

export class StringAttribute {
  private _name: AttributeName;
  private _value: AttributeValue;

  constructor(name: AttributeName, value: AttributeValue) {
    this._name = normalizeAttributeString(name);
    this._value = normalizeAttributeString(value);
  }

  get name() {
    return this._name;
  }

  get value() {
    return this._value;
  }
}

export class TokenMetadata {
  private _stringAttributes: Map<AttributeName, StringAttribute> = new Map();

  constructor(
    stringAttributes: Map<AttributeName, StringAttribute>,
  ) {
    if (!stringAttributes) { throw new Error('null stringAttributes') }
    this._stringAttributes = TokenMetadata.normalizeAttributes<StringAttribute>(stringAttributes);
  }

  get stringAttributes() {
    return this._stringAttributes;
  }

  private static normalizeAttributes<T>(attributes: Map<AttributeName, T>) {
    const normalizedAttributes = new Map<AttributeName, T>();
    attributes.forEach((attribute, attributeName) => {
      const normalizedAttributeName = normalizeAttributeString(attributeName);
      normalizedAttributes.set(normalizedAttributeName, attribute)
    });
    return normalizedAttributes
  }
}
