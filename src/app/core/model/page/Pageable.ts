import { SortPage } from '../page/SortPage';

export class Pageable {
    pageNumber: number | undefined;
    pageSize: number | undefined;
    sort: SortPage[] | undefined;
}