import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { TuitionController } from './tuition.controller';
import { TuitionService } from './tuition.service';
import { Tuition } from './tutition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tuition]), LoggerModule.forRoot()],
  controllers: [TuitionController],
  providers: [TuitionService],
})
export class TuitionModule {}
