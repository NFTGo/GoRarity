import { normalizeContractString } from './utils/attribute-utils';

export class EVMContractTokenIdentifier {
  private _contractAddress: string;
  private _tokenId: number;

  constructor(contractAddress: string, tokenId: number) {
    this._contractAddress = normalizeContractString(contractAddress);
    this._tokenId = tokenId;
  }

  get tokenId() {
    return this._tokenId;
  }

  get contractAddress() {
    return this._contractAddress;
  }

  static fromDict(dict: { contractAddress: string; tokenId: number }) {
    return new EVMContractTokenIdentifier(dict.contractAddress, dict.tokenId);
  }

  toDict() {
    return {
      contractAddress: this._contractAddress,
      tokenId: this._tokenId,
    };
  }
}
