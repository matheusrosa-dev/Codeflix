import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category Unit Tests", () => {
  let validateSpy: jest.SpyInstance;

  beforeEach(() => {
    validateSpy = jest.spyOn(Category, "validate");
  });

  describe("constructor", () => {
    it("should create a category with default values", () => {
      const category = new Category({
        name: "Movie",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });

    it("should create a category with all values", () => {
      const created_at = new Date();
      const category = new Category({
        name: "Movie",
        description: "Movie description",
        is_active: false,
        created_at,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBe(false);
      expect(category.created_at).toBe(created_at);
    });

    it("should create a category with name and description", () => {
      const category = new Category({
        name: "Movie",
        description: "Movie description",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  describe("create command", () => {
    it("should create a category", () => {
      const category = Category.create({
        name: "Movie",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it("should create a category with description", () => {
      const category = Category.create({
        name: "Movie",
        description: "Movie description",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it("should create a category with is_active", () => {
      const category = Category.create({
        name: "Movie",
        is_active: false,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(false);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("category_id field", () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new Uuid() },
    ];

    it.each(arrange)("id = %j", ({ category_id }) => {
      const category = new Category({
        name: "Movie",
        category_id: category_id as Uuid,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);

      if (category_id instanceof Uuid) {
        expect(category.category_id.id).toBe(category_id.id);
      }
    });
  });

  describe("change name", () => {
    it("should change name", () => {
      const category = Category.create({
        name: "Movie",
      });

      category.changeName("Movie 2");
      expect(category.name).toBe("Movie 2");
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("change description", () => {
    it("should change description", () => {
      const category = Category.create({
        name: "Movie",
      });

      category.changeDescription("Movie description");
      expect(category.description).toBe("Movie description");
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("activate", () => {
    it("should activate category", () => {
      const category = Category.create({
        name: "Movie",
      });

      category.activate();
      expect(category.is_active).toBe(true);
    });
  });

  describe("deactivate", () => {
    it("should deactivate category", () => {
      const category = Category.create({
        name: "Movie",
      });

      category.deactivate();
      expect(category.is_active).toBe(false);
    });
  });
});

describe("Category Validator", () => {
  describe("create command", () => {
    it("should throw an error when name is invalid", () => {
      expect(() => Category.create({ name: null })).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => Category.create({ name: "" })).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => Category.create({ name: 5 as any })).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() =>
        Category.create({ name: "a".repeat(256) })
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should throw an error when description is invalid", () => {
      expect(() =>
        Category.create({ name: "Movie", description: 5 as any })
      ).containsErrorMessages({
        description: ["description must be a string"],
      });
    });

    it("should throw an error when is_active is invalid", () => {
      expect(() =>
        Category.create({ name: "Movie", is_active: 5 as any })
      ).containsErrorMessages({
        is_active: ["is_active must be a boolean value"],
      });
    });
  });
});
