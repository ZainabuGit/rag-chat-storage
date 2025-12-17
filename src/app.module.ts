import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ThrottlerModule,
  ThrottlerModuleOptions,
} from '@nestjs/throttler';

import configuration from './config/configuration';

import { ChatSession } from './sessions/entities/chat-session.entity';
import { ChatMessage } from './messages/entities/chat-message.entity';

import { SessionsModule } from './sessions/sessions.module';
import { MessagesModule } from './messages/messages.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Load environment variables & global config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: config.get<number>('rateLimit.ttl') || 60,
            limit: config.get<number>('rateLimit.limit') || 100,
          },
        ],
      }),
    }),

    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DB_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    // Feature modules
    SessionsModule,
    MessagesModule,
    HealthModule,
  ],
})
export class AppModule {}
