import { CategoryId } from "../../../category/domain/category.aggregate";
import { GenreSearchParams } from "../genre.repository";

describe("GenreSearchParams", () => {
  describe("create", () => {
    it("should create a new instance with default values", () => {
      const searchParams = GenreSearchParams.create();

      expect(searchParams).toBeInstanceOf(GenreSearchParams);
      expect(searchParams.searchTerm).toBeNull();
    });

    it("should create a new instance with provided values", () => {
      const searchParams = GenreSearchParams.create({
        searchTerm: {
          name: "Action",
          categories_id: ["123e4567-e89b-12d3-a456-426655440000"],
        },
      });

      expect(searchParams).toBeInstanceOf(GenreSearchParams);
      expect(searchParams.searchTerm).toEqual({
        name: "Action",
        categories_id: [new CategoryId("123e4567-e89b-12d3-a456-426655440000")],
      });
    });
  });
});
