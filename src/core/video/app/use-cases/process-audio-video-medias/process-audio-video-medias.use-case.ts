import { IUseCase } from "../../../../shared/app/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { IUnitOfWork } from "../../../../shared/domain/repository/unit-of-work.interface";
import { Status } from "../../../../shared/domain/value-objects/audio-video-media.vo";
import { Video, VideoId } from "../../../domain/video.aggregate";
import { IVideoRepository } from "../../../domain/video.repository";
import { ProcessAudioVideoMediasInput } from "./process-audio-video-medias.input";

export class ProcessAudioVideoMediasUseCase
  implements
    IUseCase<ProcessAudioVideoMediasInput, ProcessAudioVideoMediasOutput>
{
  constructor(
    private uow: IUnitOfWork,
    private videoRepo: IVideoRepository,
  ) {}

  async execute(input: ProcessAudioVideoMediasInput) {
    const videoId = new VideoId(input.video_id);
    const video = await this.videoRepo.findById(videoId);

    if (!video) {
      throw new NotFoundError(input.video_id, Video);
    }

    if (input.field === "trailer") {
      if (!video.trailer) {
        throw new Error("Trailer not found");
      }

      video.trailer =
        input.status === Status.COMPLETED
          ? video.trailer.complete(input.encoded_location)
          : video.trailer.fail();
    }

    if (input.field === "video") {
      if (!video.video) {
        throw new Error("Video not found");
      }

      video.trailer =
        input.status === Status.COMPLETED
          ? video.video.complete(input.encoded_location)
          : video.video.fail();
    }

    this.uow.do(async () => {
      await this.videoRepo.update(video);
    });
  }
}

type ProcessAudioVideoMediasOutput = void;
