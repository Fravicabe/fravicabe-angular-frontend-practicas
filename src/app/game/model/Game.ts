import { Author } from "../../author/model/Author";
import { Category } from "../../category/model/Category";

export class Game {
    id: number | undefined;
    title: string | undefined;
    age: number | undefined;
    category: Category | undefined;
    author: Author | undefined;
}