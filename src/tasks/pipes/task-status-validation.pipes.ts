import { PipeTransform, ArgumentsHost, ArgumentMetadata, BadRequestException } from "@nestjs/common";
//import { TaskStatus } from "../task.model"; //BEFORE ORM
import { TaskStatus } from "../task-status-enum";

// Custom Pipe
export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ]//readonly means that even during runtime it can not be modified my the class members and here

    private isStatusValid ( status: any) {
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    }

    transform(value: any, metadata: ArgumentMetadata){
        value = value.toUpperCase();
        if (!this.isStatusValid(value)){
            throw new BadRequestException(`${value} is an invalid status!`);
            
        }else {

            return value;   
        }
     
    }
}