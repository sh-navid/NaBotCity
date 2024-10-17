import { ServerConfig } from "./ServerConfig";

export const Endpoints = Object.freeze({
  Download: (name: string) => `${ServerConfig.Url}/download/${name}`,
});
