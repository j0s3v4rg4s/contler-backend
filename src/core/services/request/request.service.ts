import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployerEntity, HotelEntity, RequestEntity } from '../../entity';
import { getConnection, Repository } from 'typeorm';
import { RequestRequest } from '../../models/request-request';
import { database } from 'firebase-admin';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { UserTokes } from '../../models/user-tokes';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(RequestEntity) private requestRepository: Repository<RequestEntity>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private http: HttpService,
  ) {}

  async create(request: RequestRequest) {
    const req = this.requestRepository.create();
    req.message = request.message;
    req.special = request.special;
    req.zone = request.zone;
    req.room = request.room;
    req.guest = request.guest;
    req.hotel = request.hotel;
    req.createAt = new Date();
    const requestEntity = await this.requestRepository.save(req);
    this.checkRequestValid(requestEntity);
    return requestEntity;
  }

  getRequest(id: number) {
    return this.requestRepository.findOne({ id }, { relations: ['guest', 'room', 'zone', 'solved'] });
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
      const request = await entityManager.findOne(RequestEntity, req.id, {
        relations: ['solved', 'guest', 'zone', 'hotel'],
      });
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
      if (req.score <= 3) {
        const node = database()
          .ref('notification')
          .child(request.hotel.uid)
          .push();
        node.set({
          uid: node.key,
          requestId: request.id,
          name: request.guest.name || '',
          zone: request.zone.name || '',
          message: request.message || '',
          view: false,
        });
      }

      await entityManager.save(request);
      await entityManager.save(employer);
    });
  }

  async getAdminRequest(hotelId: string, complete?: boolean, special?: boolean) {
    const hotel = await getConnection()
      .getRepository(HotelEntity)
      .findOne({ where: { uid: hotelId } });
    if (complete !== null && special !== null) {
      return this.requestRepository.find({
        where: { hotel, complete, special },
        relations: ['guest', 'room', 'zone', 'solved'],
      });
    } else if (complete == null) {
      return this.requestRepository.find({
        where: { hotel, special },
        relations: ['guest', 'room', 'zone', 'solved'],
      });
    } else if (special == null) {
      return this.requestRepository.find({
        where: { hotel, complete },
        relations: ['guest', 'room', 'zone', 'solved'],
      });
    } else {
      return this.requestRepository.find({
        where: { hotel },
        relations: ['guest', 'room', 'zone', 'solved'],
      });
    }
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
      const request = await entityManager.findOne(RequestEntity, { where: { id }, relations: ['solved'] });
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

  private checkRequestValid(request: RequestEntity) {
    const call = async () => {
      const requestEntity = await this.requestRepository.findOne(request.id, { relations: ['solved'] });
      if (!requestEntity.solved) {
        await this.requestRepository.update(request.id, { public: true });
        const snap = await database()
          .ref('user-tokens')
          .once('value');
        const userTokens: UserTokes = snap.val();
        if (!!userTokens) {
          const tokens = Object.values(userTokens).reduce((previousValue, currentValue) => {
            return [...previousValue, ...Object.keys(currentValue)];
          }, []);
          this.http
            .post('https://onesignal.com/api/v1/notifications', {
              app_id: process.env.ONE_SIGNAL,
              include_player_ids: tokens,
              contents: {
                es: 'Hay una nueva solicitud esperando a ser atendida',
                en: 'Hay una nueva solicitud esperando a ser atendida',
              },
              headings: {
                es: 'Nueva solicitud',
              },
            })
            .subscribe(respond => console.log(respond.data));
        }
      }
    };
    const timeOut = setTimeout(call, 60000);
    this.schedulerRegistry.addTimeout('check:' + request.id, timeOut);
  }
}
