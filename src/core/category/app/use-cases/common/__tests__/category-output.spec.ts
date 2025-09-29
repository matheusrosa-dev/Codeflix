import { Category } from "../../../../domain/category.aggregate";
import { CategoryOutputMapper } from "../category-output";

describe("CategoryOutputMapper Unit Tests", () => {
  it("should convert a category in output", () => {
    const entity = Category.create({
      name: "Movie",
      description: "some description",
      is_active: true,
    });

    const output = CategoryOutputMapper.toOutput(entity);

    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: "Movie",
      description: "some description",
      is_active: true,
      created_at: entity.created_at,
    });
  });
});
