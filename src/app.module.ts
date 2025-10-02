import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { CommonModule, StorageService } from '@Common';
import { AppController } from './app.controller';
import { AppCacheInterceptor } from './app-cache.interceptor';
import { PrismaModule } from './prisma';
import { AuthModule } from './auth';
import { RedisModule } from './redis';
import { GroupModule } from './group/group.module';
import { QuestionsModule } from './questions/questions.module';
import { OptionsModule } from './options/options.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (storageService: StorageService) => ({
        ...storageService.defaultMulterOptions,
      }),
      inject: [StorageService],
    }),
    CacheModule.register({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    CommonModule,
    PrismaModule,
    RedisModule,
    AuthModule,
    GroupModule,
    QuestionsModule,
    OptionsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AppCacheInterceptor,
    },
  ],
})
export class AppModule {}
