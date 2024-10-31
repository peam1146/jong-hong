import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from './enviroment';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    MongooseModule.forRoot(environment.MONGO_URI, {
      user: environment.MONGO_USER,
      pass: environment.MONGO_PASS,
      dbName: environment.MONGO_DBNAME,
    }),
    KafkaModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
