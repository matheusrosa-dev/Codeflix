import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CastMemberTypes } from "../../../domain/cast-member-type.vo";

export type CreateCastMemberInputConstructorProps = {
	name: string;
	type: CastMemberTypes;
};

export class CreateCastMemberInput {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsEnum(CastMemberTypes)
	@IsNotEmpty()
	type: CastMemberTypes;

	constructor(props?: CreateCastMemberInputConstructorProps) {
		if (!props) return;
		this.name = props.name;
		this.type = props.type;
	}
}
