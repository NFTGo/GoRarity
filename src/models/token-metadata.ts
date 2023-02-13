import { normalizeAttributeString } from "./utils/attribute-utils";

type AttributeName = string;
type AttributeValue = string;

export class StringAttribute {
  public name: AttributeName;
  public value: AttributeValue;

  constructor(name: AttributeName, value: AttributeValue) {
    this.name = normalizeAttributeString(name);
    this.value = normalizeAttributeString(value);
  }
}

export class TokenMetadata {
  public stringAttributes: Map<AttributeName, StringAttribute> | undefined = new Map();

  constructor(
    stringAttributes: Map<AttributeName, StringAttribute>,
  ) {
    if (!stringAttributes) { throw new Error('null stringAttributes') }
    this.stringAttributes = TokenMetadata.normalizeAttributes<StringAttribute>(stringAttributes);
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
