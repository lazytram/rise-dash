// Generic signature types - can be reused for any signature operation
export interface SignatureResponse {
  signature: `0x${string}`;
}

export interface SignatureRequest {
  playerAddress: `0x${string}`;
  amount: number;
  operationHash: `0x${string}`;
}
