import { GuestEntity } from '../entity';

export class BookingRequest {
  date!: Date;

  quote!: number;

  name!: string;

  description!: string;

  guest!: GuestEntity;
}
