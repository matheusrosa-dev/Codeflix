import { Module } from "@nestjs/common";
import { ConfigModule } from "./nest-modules/config/config.module";
import { DatabaseModule } from "./nest-modules/database/database.module";
import { CategoriesModule } from "./nest-modules/categories/categories.module";
import { SharedModule } from "./nest-modules/shared/shared.module";
import { CastMembersModule } from "./nest-modules/cast-members/cast-members.module";
import { GenresModule } from "./nest-modules/genres/genres.module";
import { VideosModule } from "./nest-modules/videos/videos.module";
import { UseCaseModule } from "./nest-modules/use-cases/use-cases.module";
import { EventModule } from "./nest-modules/events/events.module";
import { RabbitmqModule } from "./nest-modules/rabbitmq/rabbitmq.module";
import { AuthModule } from "./nest-modules/auth/auth.module";

@Module({
	imports: [
		ConfigModule.forRoot(),
		SharedModule,
		DatabaseModule,
		EventModule,
		UseCaseModule,
		RabbitmqModule.forRoot(),
		AuthModule,
		CategoriesModule,
		CastMembersModule,
		GenresModule,
		VideosModule,
	],
})
export class AppModule {}
