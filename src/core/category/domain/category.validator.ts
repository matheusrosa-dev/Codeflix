import { MaxLength } from "class-validator";
import { Category } from "./category.entity";
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields";
import { Notification } from "../../shared/domain/validators/notification";

class CategoryRules {
  @MaxLength(255, { groups: ["name"] })
  name: string;

  constructor(category: Category) {
    Object.assign(this, category);
  }
}

export class CategoryValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const fieldsToValidate = fields?.length ? fields : ["name"];
    return super.validate(
      notification,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      new CategoryRules(data),
      fieldsToValidate,
    );
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}
