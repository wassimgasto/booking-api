import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

export interface Appointment {
  id: number;
  clientName: string;
  clientEmail: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
  status: 'confirmed' | 'cancelled';
}

@Injectable()
export class AppointmentsService {
  private appointments: Appointment[] = [];
  private nextId = 1;

  create(dto: CreateAppointmentDto): Appointment {
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    if (endTime <= startTime) {
      throw new BadRequestException('endTime must be after startTime');
    }

    const overlapping = this.appointments.find(
      (a) =>
        a.status === 'confirmed' &&
        startTime < a.endTime &&
        endTime > a.startTime,
    );

    if (overlapping) {
      throw new ConflictException(
        `Time slot overlaps with appointment #${overlapping.id}`,
      );
    }

    const appointment: Appointment = {
      id: this.nextId++,
      clientName: dto.clientName,
      clientEmail: dto.clientEmail,
      startTime,
      endTime,
      notes: dto.notes,
      status: 'confirmed',
    };

    this.appointments.push(appointment);
    return appointment;
  }

  findAll(): Appointment[] {
    return this.appointments;
  }

  findOne(id: number): Appointment {
    const appointment = this.appointments.find((a) => a.id === id);
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }
    return appointment;
  }

  cancel(id: number): Appointment {
    const appointment = this.findOne(id);
    appointment.status = 'cancelled';
    return appointment;
  }
}
