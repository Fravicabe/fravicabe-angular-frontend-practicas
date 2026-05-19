import { Game } from "../../game/model/Game";
import { Client } from "../../client/model/Client";

export class Loan {
    id: number | undefined;
    game: Game | undefined;
    client: Client | undefined;
    loanDate: Date | undefined;
    returnDate: Date | undefined;
}
