import { Module } from '@nestjs/common';
import { DomainModule } from '../domain/domain.module';

@Module({
    providers: [DomainModule],
    exports: [],
})
export class InfrastructureModule { }
