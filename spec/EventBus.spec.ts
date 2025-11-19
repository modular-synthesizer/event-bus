import { beforeEach, describe, expect, it, vi } from "vitest"
import { EventBus } from "../src/EventBus"

describe("EventBus", () => {
  const bus = new EventBus()
  const mocks = {
    callback: vi.fn(),
    otherCallback: vi.fn()
  }
  const spy = vi.spyOn(mocks, "callback")
  const otherSpy = vi.spyOn(mocks, "otherCallback")

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

  describe("triggering a nested fragment", () => {
    bus.subscribe("top/leaf", mocks.callback)
    bus.subscribe("top", mocks.otherCallback)

    it("Triggers the fragment", () => {
      bus.emit("top/leaf")
      expect(mocks.callback).toHaveBeenCalledOnce()
    })
    it("Triggers the top fragment", () => {
      bus.emit("top/leaf")
      expect(mocks.otherCallback).toHaveBeenCalledOnce()
    })
  })

  describe("triggering two different callbacks", () => {
    it("Triggers both fragments with the correct payload", () => {
      bus.subscribe("test2", mocks.callback)
      bus.subscribe("test2", mocks.otherCallback)
      bus.emit("test2", { bar: "baz" })
      expect(spy).toHaveBeenCalledExactlyOnceWith({ bar: "baz" })
      expect(otherSpy).toHaveBeenCalledExactlyOnceWith({ bar: "baz" })
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