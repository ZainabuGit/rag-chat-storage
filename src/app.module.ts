import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import {
  ThrottlerModule,
  ThrottlerGuard,
} from '@nestjs/throttler';

import configuration from './config/configuration';

import { ChatSession } from './sessions/entities/chat-session.entity';
import { ChatMessage } from './messages/entities/chat-message.entity';

import { SessionsModule } from './sessions/sessions.module';
import { MessagesModule } from './messages/messages.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    /* -------------------- CONFIG -------------------- */
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    /* -------------------- RATE LIMITING -------------------- */
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'default',
          ttl: Number(config.get('RATE_LIMIT_TTL', 60000)), // milliseconds
          limit: Number(config.get('RATE_LIMIT_LIMIT', 100)),
        },
      ],
    }),

    /* -------------------- DATABASE -------------------- */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DB_URL'),
        autoLoadEntities: true,
        synchronize: true, // disable & use migrations in production
      }),
    }),

    /* -------------------- FEATURE MODULES -------------------- */
    SessionsModule,
    MessagesModule,
    HealthModule,
  ],

  providers: [
    /* Apply throttling globally */
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
