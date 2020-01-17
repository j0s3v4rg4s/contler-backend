import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployerEntity, RequestEntity, ZoneEntity } from '../../entity';
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
    return this.requestRepository.findOne({ id }, {relations: ['zone', 'solved']});
  }

  async update(request: RequestEntity) {
    return getConnection().transaction('READ COMMITTED', async entityManager => {
      const req = await entityManager.findOne(RequestEntity, request.id, { relations: ['attended', 'solved'] });
      req.attended = request.attended;
      req.solved = request.solved;
      if (request.complete && !req.complete) {
        req.finishAt = new Date();
        req.complete = true;
        const timeComplete = (req.finishAt.getTime() - req.createAt.getTime() ) / 1000 / 60;
        const employer = await entityManager.findOne(EmployerEntity, request.solved.uid);
        if (employer.totalServices) {
          employer.totalServices++;
          employer.averageTime = Number(timeComplete.toFixed(2));
        } else {
          const sumTime = employer.averageTime * employer.totalServices + timeComplete;
          employer.totalServices++;
          employer.averageTime = Number((sumTime / employer.totalServices).toFixed(2));
        }
        await entityManager.save(employer);
      }
      await entityManager.save(req);
    });
  }

  qualify(req: RequestEntity) {
    return getConnection().transaction('READ COMMITTED', async entityManager => {
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
}
