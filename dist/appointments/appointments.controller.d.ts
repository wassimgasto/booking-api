import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: CreateAppointmentDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): string;
    remove(id: string): string;
}
