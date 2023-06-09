import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Inject, Injectable } from '@nestjs/common';
import { OutboxRepositoryToken } from '../../tokens/product.tokens';
import { OutboxRepository } from '../../domain/repository/outbox.repository';
import { CronJob } from 'cron';

@Injectable()
export class OutboxCleanerScheduler {
  constructor(
    @Inject(OutboxRepositoryToken)
    private readonly outboxRepo: OutboxRepository,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    const job = new CronJob(CronExpression.EVERY_DAY_AT_MIDNIGHT, () =>
      this.clean(),
    );
    this.schedulerRegistry.addCronJob('outbox-cleaner', job);
    job.start();
  }

  async clean() {
    await this.outboxRepo.deleteAllCompletedOrFailed();
  }
}
