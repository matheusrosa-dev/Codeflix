import { CategoryOutput } from "@core/category/app/use-cases/common/category-output";
import { ListCategoriesOutput } from "@core/category/app/use-cases/list-categories/list-categories.use-case";
import { Transform } from "class-transformer";
import { CollectionPresenter } from "../shared/collection.presenter";

export class CategoryPresenter {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;

  @Transform(({ value }) => (value as Date).toISOString())
  created_at: Date;

  constructor(outpur: CategoryOutput) {
    this.id = outpur.id;
    this.name = outpur.name;
    this.description = outpur.description;
    this.is_active = outpur.is_active;
    this.created_at = outpur.created_at;
  }
}

export class CategoryCollectionPresenter extends CollectionPresenter {
  data: CategoryPresenter[];

  constructor(output: ListCategoriesOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);

    this.data = items.map((item) => new CategoryPresenter(item));
  }
}
