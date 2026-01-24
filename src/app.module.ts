import { Module } from "@nestjs/common";
import { ConfigModule } from "./nest-modules/config/config.module";
import { DatabaseModule } from "./nest-modules/database/database.module";
import { CategoriesModule } from "./nest-modules/categories/categories.module";
import { CastMembersModule } from "./nest-modules/cast-members/cast-members.module";
import { GenresModule } from "./nest-modules/genres/genres.module";
import { VideosModule } from "./nest-modules/videos/videos.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CategoriesModule,
    CastMembersModule,
    GenresModule,
    VideosModule,
  ],
})
export class AppModule {}
