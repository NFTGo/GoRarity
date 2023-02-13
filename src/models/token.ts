import { EVMContractTokenIdentifier } from "./token-identifier";
import { TokenMetadata } from "./token-metadata";
import { TokenStandard } from "./token-standard";

export class Token {
  public tokenIdentifier: EVMContractTokenIdentifier;
  public tokenStandard: TokenStandard;
  public metadata: TokenMetadata;

  constructor(tokenIdentifier: EVMContractTokenIdentifier, tokenStandard: TokenStandard, metadata: TokenMetadata) {
    this.tokenIdentifier = tokenIdentifier;
    this.tokenStandard = tokenStandard;
    this.metadata = metadata;
  }
}
