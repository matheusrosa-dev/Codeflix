import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CastMemberTypes } from "../../../domain/cast-member-type.vo";

export type UpdateCastMemberInputConstructorProps = {
	id: string;
	name?: string;
	type?: CastMemberTypes;
};

export class UpdateCastMemberInput {
	@IsString()
	@IsNotEmpty()
	id: string;

	@IsString()
	@IsOptional()
	name: string;

	@IsEnum(CastMemberTypes)
	@IsOptional()
	type: CastMemberTypes;

	constructor(props?: UpdateCastMemberInputConstructorProps) {
		if (!props) return;
		this.id = props.id;

		if (props.name) {
			this.name = props.name;
		}

		if (props.type) {
			this.type = props.type;
		}
	}
}
