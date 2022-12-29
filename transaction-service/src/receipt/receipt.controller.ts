import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Receipt } from './dto/receipt.entity';
import { ReceiptService } from './receipt.service';

@Controller('receipt')
export class ReceiptController {
  constructor(private receiptService: ReceiptService) {}

  @MessagePattern('getReceipt')
  @Get(':id')
  findOne(@Body() body) {
    return this.receiptService.getReceipt(body.transactionID);
  }
}
