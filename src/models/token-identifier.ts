export class EVMContractTokenIdentifier {
  public contractAddress: string;
  public tokenId: number;

  constructor(contractAddress: string, tokenId: number) {
    this.contractAddress = contractAddress;
    this.tokenId = tokenId;
  }

  get() {
    return `Contract(${this.contractAddress}) #${this.tokenId}`;
  }

  static fromDict(dict: { contractAddress: string, tokenId: number }) {
    return new EVMContractTokenIdentifier(dict.contractAddress, dict.tokenId);
  }

  toDict() {
    return {
      "contractAddress": this.contractAddress,
      "tokenId": this.tokenId,
    };
  }
}
