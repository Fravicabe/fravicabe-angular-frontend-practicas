import { Pageable } from "./Pageable";

export class PaginatedData <TData>{
    content: TData[] | undefined;
    pageable: Pageable | undefined;
    totalElements: number | undefined;
}