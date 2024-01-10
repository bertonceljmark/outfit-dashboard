import { Module } from '@nestjs/common';
import { ExternalService } from './external.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [ExternalService],
  controllers: [],
})
export class AppModule {}
