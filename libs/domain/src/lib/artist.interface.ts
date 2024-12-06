import { IGenre } from "./genre.interface";

export interface IArtist {
    id?: string;
    name: string;
    description: string;
    genreId?: string;
    genre?: IGenre
}