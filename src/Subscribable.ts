import { Payload } from "./Emitable"

export type Callback = (payload: Payload) => void

export interface Subscribable {
  subscribe(path: string, callback: Callback): void
  unsubscribe(path: string, callback: Callback): void
}