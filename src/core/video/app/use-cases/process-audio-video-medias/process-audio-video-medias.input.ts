import {
	IsNotEmpty,
	IsString,
	IsUUID,
	IsIn,
	validateSync,
	MaxLength,
} from "class-validator";
import { Status } from "../../../../shared/domain/value-objects/audio-video-media.vo";

export type ProcessAudioVideoMediasInputConstructorProps = {
	video_id: string;
	encoded_location: string;
	field: "trailer" | "video";
	status: Status;
};

export class ProcessAudioVideoMediasInput {
	@IsUUID("4")
	@IsString()
	@IsNotEmpty()
	video_id: string;

	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	encoded_location: string;

	@IsIn(["trailer", "video"])
	@IsNotEmpty()
	field: "trailer" | "video";

	@IsIn([Status.COMPLETED, Status.FAILED])
	@IsNotEmpty()
	status: Status;

	constructor(props?: ProcessAudioVideoMediasInputConstructorProps) {
		if (!props) return;
		this.video_id = props.video_id;
		this.encoded_location = props.encoded_location;
		this.field = props.field;
		this.status = props.status;
	}
}

export class ValidateProcessAudioVideoMediasInput {
	static validate(input: ProcessAudioVideoMediasInput) {
		return validateSync(input);
	}
}
