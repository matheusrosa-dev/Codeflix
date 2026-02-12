import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseModule } from "../../database/database.module";
import { VideosModule } from "../videos.module";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ConfigModule } from "../../config/config.module";
import { SharedModule } from "../../shared/shared.module";
import { EventModule } from "../../events/events.module";
import { VideoAudioMediaUploadedIntegrationEvent } from "@core/video/domain/domain-events/video-audio-media-replaced.event";
import { UnitOfWorkFakeInMemory } from "@core/shared/infra/db/in-memory/fake-unit-of-work-in-memory";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { UseCaseModule } from "../../use-cases/use-cases.module";
import { DynamicModule } from "@nestjs/common";

class RabbitmqModuleFake {
	static forRoot(): DynamicModule {
		return {
			module: RabbitmqModuleFake,
			global: true,
			providers: [
				{
					provide: AmqpConnection,
					useValue: {
						publish: jest.fn(),
					},
				},
			],
			exports: [AmqpConnection],
		};
	}
}

describe("VideosModule Unit Tests", () => {
	let module: TestingModule;
	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot(),
				SharedModule,
				EventModule,
				UseCaseModule,
				DatabaseModule,
				RabbitmqModuleFake.forRoot(),
				VideosModule,
			],
		})
			.overrideProvider("UnitOfWork")
			.useFactory({
				factory: () => {
					return new UnitOfWorkFakeInMemory();
				},
			})
			.compile();
		await module.init();
	});

	afterEach(async () => {
		await module.close();
	});

	it("should register handlers", async () => {
		const eventemitter2 = module.get<EventEmitter2>(EventEmitter2);
		expect(
			eventemitter2.listeners(VideoAudioMediaUploadedIntegrationEvent.name),
		).toHaveLength(1);
	});
});
