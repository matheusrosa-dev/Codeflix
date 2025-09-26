import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesController } from "../categories.controller";
import { ConfigModule } from "../../config/config.module";
import { DatabaseModule } from "../../database/database.module";
import { CategoriesModule } from "../categories.module";
import { CreateCategoryUseCase } from "@core/category/app/use-cases/create-category/create-category.use-case";
import { UpdateCategoryUseCase } from "@core/category/app/use-cases/update-category/update-category.use-case";
import { ListCategoriesUseCase } from "@core/category/app/use-cases/list-categories/list-categories.use-case";
import { GetCategoryUseCase } from "@core/category/app/use-cases/get-category/get-category.use-case";
import { DeleteCategoryUseCase } from "@core/category/app/use-cases/delete-category/delete-category.use-case";

describe("CategoriesController Integration Tests", () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();
    controller = module.get<CategoriesController>(CategoriesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(controller["createUseCase"]).toBeInstanceOf(CreateCategoryUseCase);
    expect(controller["updateUseCase"]).toBeInstanceOf(UpdateCategoryUseCase);
    expect(controller["listUseCase"]).toBeInstanceOf(ListCategoriesUseCase);
    expect(controller["getUseCase"]).toBeInstanceOf(GetCategoryUseCase);
    expect(controller["deleteUseCase"]).toBeInstanceOf(DeleteCategoryUseCase);
  });

  it("should create a category", () => {});

  it("should update a category", () => {});
});
//agente viu este tipo de teste no curso
//end to end
