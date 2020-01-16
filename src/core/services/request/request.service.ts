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
    return this.requestRepository.findOne({ id });
  }

  updateAttend(idGuest: string, idRequest: number) {
    return getConnection().transaction(async entityManager => {
      const employer = await entityManager.findOne(EmployerEntity, idGuest);
      await entityManager.update(RequestEntity, { id: idRequest }, { attended: employer });
    });
  }

  async updateSolved(idGuest: string, idRequest: number) {
    return getConnection().transaction(async entityManager => {
      const employer = await entityManager.findOne(EmployerEntity, idGuest);
      await entityManager.update(RequestEntity, { id: idRequest }, { solved: employer });
    });
  }

  qualify(id: number, score: number, comment?: string) {
    return getConnection().transaction('REPEATABLE READ', async entityManager => {
      const request = await entityManager.findOne(RequestEntity, id, { relations: ['solved'] });
      request.score = score;
      request.comment = comment;
      const employer = await entityManager.findOne(EmployerEntity, request.solved.uid);
      if (employer.totalScore === 0) {
        employer.totalScore++;
        employer.averageScore = score;
      } else {
        const sumScore = employer.averageScore * employer.totalScore + score;
        employer.totalScore++;
        employer.averageScore = sumScore / employer.totalScore;
      }
      await entityManager.save(request);
      await entityManager.save(employer);
    });
  }
}
