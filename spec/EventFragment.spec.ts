import { describe, it, expect } from "vitest"
import { EventFragment } from "../src/EventFragment"

describe("creation of a child fragment", () => {
  const fragment = new EventFragment("foo")
  const child = fragment.getOrCreate("bar")

  it("Has created a child in the base fragment", () => {
    expect(fragment.children.length).toBe(1)
  })
  it("Has created the child with the correct subpath", () => {
    expect(child.content).toEqual("bar")
  })
  it("Has created the child with the correct parent", () => {
    expect(child.parent).toEqual(fragment)
  })
  it("Does not create an already existing child", () => {
    fragment.getOrCreate("bar")
    expect(fragment.children.length).toBe(1)
  })
})