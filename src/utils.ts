export const arrayBufferToHexString = (arrayBuffer: ArrayBuffer) =>
  Array.prototype.map
    .call(new Uint8Array(arrayBuffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("")

export const stringToArrayBuffer = (str: string) => new TextEncoder().encode(str).buffer

export const hexStringToArrayBuffer = (hexString: string) =>
  new Uint8Array(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))).buffer
