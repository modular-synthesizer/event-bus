export type Payload = Record<string, unknown>

export interface Emitable {
  emit(path: string, payload: Payload): boolean
}