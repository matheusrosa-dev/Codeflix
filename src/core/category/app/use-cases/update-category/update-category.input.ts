import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export type UpdateCategoryInputConstructorProps = {
  id: string;
  name?: string;
  description?: string | null;
  is_active?: boolean;
};

export class UpdateCategoryInput {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  constructor(props?: UpdateCategoryInputConstructorProps) {
    if (!props) return;
    this.id = props.id;

    if (props.name) {
      this.name = props.name;
    }

    if (props.description) {
      this.description = props.description;
    }

    if (typeof props.is_active === "boolean") {
      this.is_active = props.is_active;
    }
  }
}
