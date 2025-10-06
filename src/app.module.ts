import { Module } from "@nestjs/common";
import { CategoriesModule } from "./nest-modules/categories/categories.module";
import { DatabaseModule } from "./nest-modules/database/database.module";
import { ConfigModule } from "./nest-modules/config/config.module";
import { CastMembersModule } from "./nest-modules/cast-members/cast-members.module";
import { GenresModule } from "./nest-modules/genres/genres.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CategoriesModule,
    CastMembersModule,
    ConfigModule,
    GenresModule,
  ],
})
export class AppModule {}
