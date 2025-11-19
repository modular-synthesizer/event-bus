import { beforeEach, describe, expect, it, vi } from "vitest"
import { EventBus } from "../src/EventBus"

describe("EventBus", () => {
  const bus = new EventBus()
  const mocks = { callback: vi.fn() }
  const spy = vi.spyOn(mocks, "callback")

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  describe("triggering a fragment", () => {
    bus.subscribe("foo", mocks.callback)

    it("Triggers the fragment correctly", () => {
      bus.emit("foo")
      expect(spy).toHaveBeenCalledOnce()
    })
    it("Only triggers it once", () => {
      bus.subscribe("foo", mocks.callback)
      bus.emit("foo")
      expect(spy).toHaveBeenCalledOnce()
    })
    it("Triggers it with a payload", () => {
      bus.emit("foo", { bar: "baz" })
      expect(spy).toHaveBeenCalledExactlyOnceWith({ bar: "baz" })
    })
    it("does not trigger the fragment if removed", () => {
      bus.unsubscribe("foo", mocks.callback)
      bus.emit("foo")
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe("triggering a variable fragment", () => {
    bus.subscribe("foo/[test]", mocks.callback)

    it("Triggers the fragment correctly", () => {
      bus.emit("foo/bar")
      expect(spy).toHaveBeenCalledExactlyOnceWith({})
    })
    it("Triggers the fragment correctly with a payload", () => {
      bus.emit("foo/bar", { baz: "test" })
      expect(spy).toHaveBeenCalledExactlyOnceWith({ baz: "test" })
    })
  })
})