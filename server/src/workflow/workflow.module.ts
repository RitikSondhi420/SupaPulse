import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowResolver } from './workflow.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [WorkflowService, WorkflowResolver],
  exports: [WorkflowService],
})
export class WorkflowModule {}
