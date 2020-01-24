import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployerEntity, HotelEntity, RequestEntity } from '../../entity';
import { getConnection, Repository } from 'typeorm';
import { RequestRequest } from '../../models/request-request';

@Injectable()
export class RequestService {
  constructor(@InjectRepository(RequestEntity) private requestRepository: Repository<RequestEntity>) {}

  create(request: RequestRequest) {
    const req = this.requestRepository.create();
    req.message = request.message;
    req.special = request.special;
    req.zone = request.zone;
    req.room = request.room;
    req.guest = request.guest;
    req.hotel = request.hotel;
    req.createAt = new Date();
    return this.requestRepository.save(req);
  }

  getRequest(id: number) {
    return this.requestRepository.findOne({ id }, { relations: ['zone', 'solved'] });
  }

  async update(request: RequestEntity) {
    const req = await this.requestRepository.findOne(request.id);
    if (request.complete && !req.complete) {
      request.finishAt = new Date();
    }
    return this.requestRepository.save(request);
  }

  qualify(req: RequestEntity) {
    return getConnection().transaction('READ UNCOMMITTED', async entityManager => {
      const request = await entityManager.findOne(RequestEntity, req.id, { relations: ['solved'] });
      request.score = req.score;
      request.comment = req.comment;
      const employer = await entityManager.findOne(EmployerEntity, request.solved.uid);
      if (employer.totalScore === 0) {
        employer.totalScore++;
        employer.averageScore = req.score;
      } else {
        const sumScore = employer.averageScore * employer.totalScore + req.score;
        employer.totalScore++;
        employer.averageScore = Number((sumScore / employer.totalScore).toFixed(2));
      }
      await entityManager.save(request);
      await entityManager.save(employer);
    });
  }

  async getRequestByHotel(hotelId: string) {
    const hotel = await getConnection()
      .getRepository(HotelEntity)
      .findOne({ where: { uid: hotelId } });
    return this.requestRepository.find({
      where: { hotel, special: false },
      relations: ['guest', 'room', 'zone', 'solved'],
    });
  }

  async getSpecialRequestByHotel(hotelId: string, complete?: boolean) {
    const hotel = await getConnection()
      .getRepository(HotelEntity)
      .findOne({ where: { uid: hotelId } });
    if (complete !== undefined) {
      return this.requestRepository.find({
        where: { hotel, complete, special: true },
        relations: ['guest', 'room', 'zone', 'solved'],
      });
    } else {
      return this.requestRepository.find({
        where: { hotel, special: true },
        relations: ['guest', 'room', 'zone', 'solved'],
      });
    }
  }

  calculateAverageTime(id: number) {
    return getConnection().transaction('READ UNCOMMITTED', async entityManager => {
      const request = await entityManager.findOne(RequestEntity, id);
      if (request.complete) {
        const timeAverage = await entityManager
          .createQueryBuilder(RequestEntity, 'request')
          .select('avg("finishAt" - "createAt")', 'avg')
          .addSelect('count(*)', 'count')
          .where('request.complete = true')
          .andWhere('request."solvedUid" = :id', { id: request.solved.uid })
          .getRawOne();
        const employer = await entityManager.findOne(EmployerEntity, { uid: request.solved.uid });
        employer.averageTime = timeAverage.avg;
        employer.totalTime = timeAverage.count;
        employer.totalServices = timeAverage.count;
        await entityManager.save(employer);
      }
    });
  }
}
