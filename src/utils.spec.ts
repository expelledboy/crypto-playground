import { arrayBufferToHexString, hexStringToArrayBuffer, stringToArrayBuffer } from "./utils"

const fixture = {
  arrayBuffer: new Uint8Array([0x01, 0x02, 0x03]).buffer,
  hexString: "010203",
}

test("arrayBufferToHexString", () => {
  const hexString = arrayBufferToHexString(fixture.arrayBuffer)

  expect(hexString).toEqual(fixture.hexString)
})

test("stringToArrayBuffer", () => {
  const arrayBuffer = stringToArrayBuffer(fixture.hexString)

  expect(arrayBuffer).toEqual(fixture.arrayBuffer)
})

test("hexStringToArrayBuffer", () => {
  const hexString = "010203"
  const arrayBuffer = hexStringToArrayBuffer(hexString)

  expect(arrayBuffer).toEqual(new Uint8Array([0x01, 0x02, 0x03]).buffer)
})
