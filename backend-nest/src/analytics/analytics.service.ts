import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async create(logData: any) {
    return this.prisma.behavior_logs.create({
      data: {
        session_id: logData.session_id,
        user_id: logData.user_id ? Number(logData.user_id) : null,
        action_type: logData.action_type,
        page_url: logData.page_url,
        element_id: logData.element_id || null,
        duration_seconds: logData.duration_seconds !== undefined ? Number(logData.duration_seconds) : null,
        ip_address: logData.ip_address || null,
        user_agent: logData.user_agent || null,
        payload: logData.payload || null,
      },
    });
  }

  async getAllLogs(limit = 100) {
    return this.prisma.behavior_logs.findMany({
      orderBy: { created_at: 'desc' },
      take: limit,
      include: {
        users: true,
      },
    });
  }
}
