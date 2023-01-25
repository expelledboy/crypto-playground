import * as crypto from "isomorphic-webcrypto"

// https://blog.engelke.com/2015/02/14/deriving-keys-from-passwords-with-webcrypto/
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#supported_algorithms

export const CryptoService: CryptoService = {} as CryptoService
