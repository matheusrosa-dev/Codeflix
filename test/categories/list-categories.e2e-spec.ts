import request from "supertest";
import { instanceToPlain } from "class-transformer";
import { ICategoryRepository } from "../../src/core/category/domain/category.repository";
import { CategoryOutputMapper } from "../../src/core/category/app/use-cases/common/category-output";
import * as CategoryProviders from "../../src/nest-modules/categories/categories.providers";
import { startApp } from "../../src/nest-modules/shared/testing/helpers";
import { CategoriesController } from "../../src/nest-modules/categories/categories.controller";
import { ListCategoriesFixture } from "../../src/nest-modules/categories/testing/category-fixture";

describe("CategoriesController (e2e)", () => {
	describe("/categories (GET)", () => {
		describe("unauthenticated", () => {
			const app = startApp();

			test("should return 401 when not authenticated", () => {
				return request(app.app.getHttpServer())
					.get("/categories")
					.send({})
					.expect(401);
			});

			test("should return 403 when not authenticated as admin", () => {
				return request(app.app.getHttpServer())
					.get("/categories")
					.authenticate(app.app, false)
					.send({})
					.expect(403);
			});
		});

		describe("should return categories sorted by created_at when request query is empty", () => {
			let categoryRepo: ICategoryRepository;

			const appHelper = startApp();
			const { entitiesMap, arrange } =
				ListCategoriesFixture.arrangeIncrementedWithCreatedAt();

			beforeEach(async () => {
				categoryRepo = appHelper.app.get<ICategoryRepository>(
					CategoryProviders.REPOSITORIES.CATEGORY_REPOSITORY.provide,
				);
				await categoryRepo.bulkInsert(Object.values(entitiesMap));
			});

			test.each(arrange)("when query params is $send_data", async ({
				send_data,
				expected,
			}) => {
				const queryParams = new URLSearchParams(send_data as any).toString();
				return request(appHelper.app.getHttpServer())
					.get(`/categories?${queryParams}`)
					.authenticate(appHelper.app)
					.expect(200)
					.expect({
						data: expected.entities.map((e) =>
							instanceToPlain(
								CategoriesController.serialize(
									CategoryOutputMapper.toOutput(e),
								),
							),
						),
						meta: expected.meta,
					});
			});
		});

		describe("should return categories using paginate, searchTerm and sort", () => {
			let categoryRepo: ICategoryRepository;
			const appHelper = startApp();
			const { entitiesMap, arrange } = ListCategoriesFixture.arrangeUnsorted();

			beforeEach(async () => {
				categoryRepo = appHelper.app.get<ICategoryRepository>(
					CategoryProviders.REPOSITORIES.CATEGORY_REPOSITORY.provide,
				);
				await categoryRepo.bulkInsert(Object.values(entitiesMap));
			});

			test.each([arrange])("when query params is $send_data", async ({
				send_data,
				expected,
			}) => {
				const queryParams = new URLSearchParams(send_data as any).toString();
				return request(appHelper.app.getHttpServer())
					.get(`/categories/?${queryParams}`)
					.authenticate(appHelper.app)
					.expect(200)
					.expect({
						data: expected.entities.map((e) =>
							instanceToPlain(
								CategoriesController.serialize(
									CategoryOutputMapper.toOutput(e),
								),
							),
						),
						meta: expected.meta,
					});
			});
		});
	});
});
