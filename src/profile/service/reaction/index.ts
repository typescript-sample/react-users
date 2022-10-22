import { HttpRequest } from 'axios-core';

export interface ReactService {
    react(id: string, author: string, reaction: string): Promise<number | undefined>;
    unreact(id: string, author: string, reaction: string): Promise<number | undefined>;
    checkReaction(id: string, author: string): Promise<number | undefined>;
}

export class ReactClient implements ReactService {
    constructor(protected http: HttpRequest, protected url: string) {
        this.react = this.react.bind(this);
        this.unreact = this.unreact.bind(this);
    }
    react(id: string, author: string, reaction: string): Promise<number> {
        const url = this.url + '/reaction/' + id + '/' + author + '/' + reaction
        return this.http.get(url)
    }
    unreact(id: string, author: string, reaction: string): Promise<number> {
        const url = this.url + '/unreaction/' + id + '/' + author + '/' + reaction
        return this.http.delete(url)
    }
    checkReaction(id: string, author: string): Promise<number> {
        const url = this.url + '/checkreaction/' + id + '/' + author 
        return this.http.get(url)
    }

}