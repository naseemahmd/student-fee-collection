import {
  Injectable,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tuition } from './tutition.entity';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class TuitionService {
  constructor(
    @InjectRepository(Tuition) private tuitionRepository: Repository<Tuition>,
    private _logger: PinoLogger,
  ) {
    _logger.setContext(TuitionService.name);
  }

  //Get All Tuitions
  async getTuitions() {
    this._logger.info(`getTuitions is called`);
    try {
      const tuitions = await this.tuitionRepository.find();
      this._logger.info(`getTuitions is feteched`);
      return tuitions;
    } catch (error) {
      this._logger.info(`getTuitions is error with ${error}`);
      return new BadGatewayException(
        'Issue on geting tuition! Please Try Again',
      );
    }
  }
  //FIND One Tuitions
  async findOne(id: string) {
    this._logger.info(`findOne is called with ${id}`);
    try {
      const tuition = await this.tuitionRepository.findOneBy({ id: id });
      this._logger.info(`findOne is called with ${id} is feteched`);
      return { ...tuition };
    } catch (error) {
      this._logger.info(`findOne Tuition is error with ${error}`);
      return new BadGatewayException('Issue on fetching Tuition');
    }
  }

  //FIND One Tuitions by TuitionID
  async findOneByID(tuitionID: string) {
    this._logger.info(`findOne tuition with ${tuitionID} is called`);
    try {
      const tuition = await this.tuitionRepository.findBy({
        tuitionID: tuitionID,
      });
      this._logger.info(`findOne tuition with ${tuitionID} is feteched`);
      return { ...tuition[0] };
    } catch (error) {
      this._logger.info(
        `findOne tuition with ${tuitionID} is error with ${error}`,
      );
      return new BadGatewayException('Issue on fetching Tuition');
    }
  }

  //Create Tuition
  async createTuition(tuition: Tuition): Promise<Tuition | Error> {
    this._logger.info(`createTuition is called with ${tuition}`);
    try {
      const createdTuition = await this.tuitionRepository.save(tuition);
      this._logger.info(`createTuition is called is sucuess`);
      return { ...createdTuition };
    } catch (error) {
      this._logger.info(`createTuition is called is error with ${error}`);
      return new BadGatewayException(
        'Issue on create tuition! Please Try Again',
      );
    }
  }

  //Edit Tuition
  async editTuition(id: string, tuition: Tuition): Promise<Tuition | Error> {
    this._logger.info(`update is called with ${tuition} for ${id}`);
    try {
      const editTuition = await this.tuitionRepository.findOneBy({ id: id });

      if (!editTuition) {
        this._logger.info(`Tuition is not found for ${id}`);
        return new NotFoundException('Tuition is not found');
      }
      await this.tuitionRepository.update(id, tuition);
      const editedTuition = await this.tuitionRepository.findOneBy({ id: id });
      this._logger.info(
        `update is called with ${tuition} for ${id} is succuess`,
      );
      return { ...editedTuition };
    } catch (error) {
      this._logger.info(`updateTuition is called is error with ${error}`);
      return new BadGatewayException(
        'Issue on update tuition! Please Try Again',
      );
    }
  }

  //Remove Tuition
  async remove(id: string) {
    this._logger.info(`Remove Tuition is called for ${id}`);
    try {
      await this.tuitionRepository.delete(id);
      this._logger.info(`Remove Tuition is called for ${id} sucuess`);
      return 'Tuition Removed';
    } catch (error) {
      this._logger.info(
        `Remove Tuition is called for ${id} error with ${error}`,
      );
      return new BadGatewayException('Error on Tuition Removed');
    }
  }
}
