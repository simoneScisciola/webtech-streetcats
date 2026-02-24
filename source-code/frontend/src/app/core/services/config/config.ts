import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Config {

  // -- State and Signals -----------------------------------------------------

  private config: Record<string, string> = {};

  // -- Methods ---------------------------------------------------------------

  async load(): Promise<void> {

    console.log("Loading the environment variables...");

    const resp = await fetch('/assets/env.js');
    const js = await resp.text();

    new Function(js)();

    this.config = (globalThis as any).__env || {};

    console.log("Environment variables successfully loaded", this.config);
  }

  get(key: string): string {
    return this.config?.[key];
  }

}