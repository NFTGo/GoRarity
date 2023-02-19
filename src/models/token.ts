import { EVMContractTokenIdentifier } from './token-identifier';
import { TokenMetadata, TraitType, TraitValue } from './token-metadata';
import { TokenStandard } from './token-standard';

export class Token {
  private _tokenIdentifier: EVMContractTokenIdentifier;
  private _tokenStandard: TokenStandard;
  private _metadata: TokenMetadata;

  constructor(tokenIdentifier: EVMContractTokenIdentifier, tokenStandard: TokenStandard, metadata: TokenMetadata) {
    this._tokenIdentifier = tokenIdentifier;
    this._tokenStandard = tokenStandard;
    this._metadata = metadata;
  }

  get tokenIdentifier() {
    return this._tokenIdentifier;
  }

  get tokenStandard() {
    return this._tokenStandard;
  }

  get metadata() {
    return this._metadata;
  }

  static fromErc721(
    contractAddress: string,
    tokenId: number,
    traits: { traitType: TraitType; traitValue: TraitValue }[]
  ) {
    return new Token(
      new EVMContractTokenIdentifier(contractAddress, tokenId),
      TokenStandard.ERC721,
      TokenMetadata.fromTokenTraits(traits)
    );
  }

  hasTrait(traitName: TraitType) {
    return this.metadata.traitExists(traitName);
  }

  traitCount() {
    return this._metadata.stringTraits.size;
  }
}
