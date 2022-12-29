import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TuitionService } from './tuition.service';
import { Tuition } from './tutition.entity';

@Controller('tuition')
export class TuitionController {
  constructor(private tuitionService: TuitionService) {}

  @MessagePattern('getAllTuitions')
  @Get()
  findAll() {
    return this.tuitionService.getTuitions();
  }

  @MessagePattern('getOneTuition')
  @Get(':id')
  async findOne(@Param('id') id) {
    return await this.tuitionService.findOne(id);
  }

  @MessagePattern('createTuition')
  @Post('create')
  async create(@Body() tuition: Tuition) {
    return await this.tuitionService.createTuition(tuition);
  }

  @MessagePattern('updateTuition')
  @Patch('update:id')
  async editTuition(@Body() body: any) {
    return await this.tuitionService.editTuition(body.id, body.tuition);
  }

  @MessagePattern('DeleteTuition')
  @Delete('delete:id')
  async remove(@Body() id: string) {
    return await this.tuitionService.remove(id);
  }
}
