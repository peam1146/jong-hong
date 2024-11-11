import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { environment } from '../enviroment';
import { KafkaModule } from '../kafka/kafka.module';
import { UserModule } from '../user/user.module';
import { JWTAuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: environment.JWT_SECRET,
      signOptions: {
        expiresIn: environment.JWT_EXPIRE_IN,
      },
    }),
    UserModule,
    PassportModule,
    KafkaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JWTAuthGuard],
})
export class AuthModule {}
