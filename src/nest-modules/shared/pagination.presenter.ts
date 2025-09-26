import { Transform } from "class-transformer";

export type PaginationPresenterProps = {
  current_page: number;
  per_page: number;
  last_page: number;
  total: number;
};

export class PaginationPresenter {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @Transform(({ value }) => parseInt(value))
  current_page: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @Transform(({ value }) => parseInt(value))
  per_page: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @Transform(({ value }) => parseInt(value))
  last_page: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @Transform(({ value }) => parseInt(value))
  total: number;

  constructor(props: PaginationPresenterProps) {
    this.current_page = props.current_page;
    this.per_page = props.per_page;
    this.last_page = props.last_page;
    this.total = props.total;
  }
}
