import { literal, Op } from "sequelize";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from "../../../domain/category.repository";
import { CategoryModel } from "./category.model";
import { CategoryModelMapper } from "./category-model-mapper";
import { SortDirection } from "@core/shared/domain/repository/search-params";

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ["name", "created_at"];
  orderBy = {
    mysql: {
      name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`), //ascii
    },
  };

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(category: Category): Promise<void> {
    const model = CategoryModelMapper.toModel(category).toJSON();

    await this.categoryModel.create(model);
  }

  async bulkInsert(categories: Category[]): Promise<void> {
    const models = categories.map((category) =>
      CategoryModelMapper.toModel(category).toJSON(),
    );

    await this.categoryModel.bulkCreate(models);
  }

  async update(category: Category): Promise<void> {
    const category_id = category.category_id.id;
    const foundCategory = await this.categoryModel.findByPk(category_id);

    if (!foundCategory) {
      throw new NotFoundError(category_id, this.getEntity());
    }

    const model = CategoryModelMapper.toModel(category).toJSON();

    await this.categoryModel.update(model, {
      where: {
        category_id,
      },
    });
  }

  async delete(category_id: Uuid): Promise<void> {
    const foundCategory = await this.categoryModel.findByPk(category_id.id);

    if (!foundCategory) {
      throw new NotFoundError(category_id.id, this.getEntity());
    }

    await this.categoryModel.destroy({
      where: {
        category_id: category_id.id,
      },
    });
  }

  async findById(category_id: Uuid): Promise<Category> {
    const model = await this.categoryModel.findByPk(category_id.id);

    if (!model) return null;

    const category = CategoryModelMapper.toEntity(model);

    return category;
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();

    return models.map((model) => CategoryModelMapper.toEntity(model));
  }

  getEntity() {
    return Category;
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.searchTerm && {
        where: {
          name: { [Op.like]: `%${props.searchTerm}%` },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: this.formatSort(props.sort, props.sort_dir) }
        : { order: [["created_at", "desc"]] }),
      offset,
      limit,
    });
    return new CategorySearchResult({
      items: models.map((model) => {
        return CategoryModelMapper.toEntity(model);
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  private formatSort(sort: string, sort_dir: SortDirection) {
    const dialect = this.categoryModel.sequelize.getDialect() as "mysql";

    if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
      return this.orderBy[dialect][sort](sort_dir);
    }

    return [[sort, sort_dir]];
  }
}
