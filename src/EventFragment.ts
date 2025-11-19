import { filter, find } from "lodash"
import type { EventBusCallback } from "./EventBus";

export class EventFragment {
  private _content: string;
  private _children: EventFragment[] = [];
  private callbacks: EventBusCallback[] = [];
  private _parent?: EventFragment;

  public constructor(content: string, _parent?: EventFragment) {
    this._content = content;
    this._parent = _parent;
  }

  /**
   * Creates a fragment if not already present, and links it to the current fragment as _parent/child
   * @param path the path to the fragment you're trying to create.
   * @returns the fragment, after initializing it if needed.
   */
  public getOrCreate(path: string): EventFragment {
    let fragment: EventFragment = find(this._children, { content: path }) as EventFragment;
    if (fragment === undefined) {
      fragment = new EventFragment(path, this)
      this._children.push(fragment);
    }
    return fragment;
  }

  public addCallback(callback: EventBusCallback) {
    if (!this.callbacks.includes(callback)) this.callbacks.push(callback);
  }

  public removeCallback(callback: EventBusCallback) {
    this.callbacks = this.callbacks.filter(c => c !== callback);
  }

  public get(content: string) {
    return filter(this._children, (child: EventFragment) => {
      return child.matches(content);
    })
  }

  public trigger(_path: string, payload: Record<string, unknown>) {
    for(const callback of this.callbacks) callback(payload);
  }

  public remove(fragment: string) {
    if (fragment === "") {
      this.callbacks = [];
      return;
    }
    const splitted: string[] = fragment.split("/");
    if (this.has(splitted[0])) {
      for (const f of this.get(splitted[0])) {
        f.remove(splitted.slice(1).join("/"))
      }
    }
  }

  private has(content: string): boolean {
    return !!find(this._children, (child: EventFragment) => {
      return child.matches(content);
    });
  }

  private matches(content: string): boolean {
    return /^\[[a-z]+\]$/.test(this._content) || this._content === content;
  }

  private get path(): string {
    if (this._parent === undefined) return this._content;
    return [this._parent.path, this._content].join('/');
  }

  public get children() {
    return this._children
  }

  public get content() {
    return this._content
  }

  public get parent() {
    return this._parent
  }
}