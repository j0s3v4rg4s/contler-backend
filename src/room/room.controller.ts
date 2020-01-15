import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { RoomEntity } from '../core/entity';
import { RoomService } from '../core/services/room/room.service';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Put()
  updateRoom(@Body() room: RoomEntity) {
    return this.roomService.updateRoom(room);
  }

  @Delete(':id')
  deleteRoom(@Param('id') id: string) {
    return this.roomService.deleteRoom(id);
  }
}
