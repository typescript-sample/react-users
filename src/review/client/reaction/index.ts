import { HttpRequest } from "axios-core";
import { ReactionService, Useful, UsefulFilter, usefulModel } from "./reaction";

export * from "./reaction";

export class ReactionClient implements ReactionService {
  constructor(protected http: HttpRequest, protected url: string) {
    this.setUseful = this.setUseful.bind(this);
    this.removeUseful = this.removeUseful.bind(this);
  }

  setUseful(
    id: string,
    author: string,
    userId: string,
    ctx?: any
  ): Promise<number> {
    const url = `${this.url}/${id}/${author}/useful/${userId}`;
    return this.http.post(url,{},ctx);
  }

  removeUseful(
    id: string,
    author: string,
    userId: string,
    ctx?: any
  ): Promise<number> {
    const url = `${this.url}/${id}/${author}/useful/${userId}`;
    return this.http.delete(url, ctx);
  }

}
