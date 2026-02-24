import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => {
				return {
					privateKey: configService.get("JWT_PRIVATE_KEY_FOR_TESTING"),
					publicKey: configService.get("JWT_PUBLIC_KEY"),
					signOptions: {
						algorithm: "RS256",
					},
				};
			},
			inject: [ConfigService],
			global: true,
		}),
	],
	controllers: [AuthController],
	providers: [AuthGuard],
})
export class AuthModule {}
