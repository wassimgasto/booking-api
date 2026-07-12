import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Appointment } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    if (endTime <= startTime) {
      throw new BadRequestException('endTime must be after startTime');
    }

    const overlapping = await this.prisma.appointment.findFirst({
      where: {
        status: 'confirmed',
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (overlapping) {
      throw new ConflictException(
        `Time slot overlaps with appointment #${overlapping.id}`,
      );
    }

    return this.prisma.appointment.create({
      data: {
        clientName: dto.clientName,
        clientEmail: dto.clientEmail,
        startTime,
        endTime,
        notes: dto.notes,
      },
    });
  }

  findAll(): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({
      orderBy: { startTime: 'asc' },
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }
    return appointment;
  }

  async cancel(id: number): Promise<Appointment> {
    await this.findOne(id);
    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }
}
