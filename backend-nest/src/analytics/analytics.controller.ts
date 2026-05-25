import { Controller, Get, Post, Body, Req, Query, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { AnalyticsService } from './analytics.service';

@Controller()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Post('analytics')
  async logBehavior(@Body() body: any, @Req() req: any, @Res() res: Response) {
    const sessionId = body.session_id;
    const actionType = body.action_type;
    const pageUrl = body.page_url;

    if (!sessionId || !actionType || !pageUrl) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Session ID, action type, and page URL are required.',
      });
    }

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;

    const logData: any = {
      session_id: sessionId,
      action_type: actionType,
      page_url: pageUrl,
      element_id: body.element_id || null,
      duration_seconds: body.duration_seconds,
      ip_address: typeof ipAddress === 'string' ? ipAddress.split(',')[0].trim() : ipAddress,
      user_agent: userAgent,
      payload: body.payload || null,
    };

    if (req.session && req.session.user_id) {
      logData.user_id = Number(req.session.user_id);
    }

    try {
      await this.analyticsService.create(logData);
      return res.status(HttpStatus.OK).json({
        success: true,
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Get('admin/analytics')
  async getBehaviorLogs(@Req() req: any, @Res() res: Response) {
    if (!req.session || !req.session.user_id || req.session.user_role !== 'admin') {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        error: 'Forbidden. Admin privileges required.',
      });
    }

    try {
      const logs = await this.analyticsService.getAllLogs();
      return res.status(HttpStatus.OK).json({
        success: true,
        data: logs.map(log => ({
          id: log.id,
          session_id: log.session_id,
          user_id: log.user_id,
          customer_name: log.users?.name || null,
          action_type: log.action_type,
          page_url: log.page_url,
          element_id: log.element_id,
          duration_seconds: log.duration_seconds ? Number(log.duration_seconds) : null,
          payload: log.payload,
          created_at: log.created_at,
        })),
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }
}
