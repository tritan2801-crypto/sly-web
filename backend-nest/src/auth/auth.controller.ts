import { Controller, Post, Body, Req, Get, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any, @Req() req: any, @Res() res: Response) {
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();
    const password = body.password || '';

    if (!name || !email || !phone || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'All fields (name, email, phone, password) are required.',
      });
    }

    if (!email.includes('@')) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Invalid email address format.',
      });
    }

    try {
      const existingUser = await this.authService.findByEmail(email);
      if (existingUser) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'Email address is already registered.',
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await this.authService.create(name, email, phone, passwordHash);

      // Assign role (3 = customer)
      await this.authService.assignRole(user.id, 3);

      // Create loyalty record
      await this.authService.createLoyaltyRecord(user.id);

      // Store in session
      req.session.user_id = user.id;
      req.session.user_email = email;
      req.session.user_name = name;
      req.session.user_role = 'customer';

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Registration successful.',
        data: {
          id: user.id,
          name,
          email,
          phone,
        },
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Post('login')
  async login(@Body() body: any, @Req() req: any, @Res() res: Response) {
    const email = (body.email || '').trim();
    const password = body.password || '';

    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Email and password are required.',
      });
    }

    try {
      const user = await this.authService.findByEmail(email);
      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: 'Invalid email or password.',
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: 'Invalid email or password.',
        });
      }

      if (user.status !== 'active') {
        return res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          error: 'Account is suspended or inactive.',
        });
      }

      const profile = await this.authService.findById(user.id);
      if (!profile) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          error: 'User profile not found.',
        });
      }

      req.session.user_id = user.id;
      req.session.user_email = user.email;
      req.session.user_name = user.name;
      req.session.user_role = profile.role;

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Login successful.',
        data: profile,
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Post('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    req.session = null;
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Logged out successfully.',
    });
  }

  @Get('me')
  async me(@Req() req: any, @Res() res: Response) {
    if (!req.session || !req.session.user_id) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: 'Unauthorized. No active session.',
      });
    }

    try {
      const userId = Number(req.session.user_id);
      const profile = await this.authService.findById(userId);

      if (!profile) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          error: 'User profile not found.',
        });
      }

      const loyalty = await this.authService.getUserLoyalty(userId);
      (profile as any).loyalty = loyalty;

      return res.status(HttpStatus.OK).json({
        success: true,
        data: profile,
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Post('update-profile')
  async updateProfile(@Body() body: any, @Req() req: any, @Res() res: Response) {
    if (!req.session || !req.session.user_id) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: 'Unauthorized. No active session.',
      });
    }

    const userId = Number(req.session.user_id);
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();

    if (!name || !email || !phone) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'All fields (name, email, phone) are required.',
      });
    }

    try {
      const existingUser = await this.authService.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'Email address is already in use by another account.',
        });
      }

      await this.authService.updateProfile(userId, name, email, phone);

      // Update session values
      req.session.user_email = email;
      req.session.user_name = name;

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Profile updated successfully.',
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Post('change-password')
  async changePassword(@Body() body: any, @Req() req: any, @Res() res: Response) {
    if (!req.session || !req.session.user_id) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: 'Unauthorized. No active session.',
      });
    }

    const userId = Number(req.session.user_id);
    const currentPassword = body.current_password || '';
    const newPassword = body.new_password || '';

    if (!currentPassword || !newPassword) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Current password and new password are required.',
      });
    }

    try {
      const user = await this.authService.findById(userId);
      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: 'User profile not found.',
        });
      }
      
      const dbUser = await this.authService.findByEmail(user.email);
      if (!dbUser) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          error: 'User database record not found.',
        });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, dbUser.password_hash);
      if (!isValidPassword) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'Mật khẩu hiện tại không chính xác.',
        });
      }

      if (newPassword.length < 6) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'Mật khẩu mới phải có ít nhất 6 ký tự.',
        });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await this.authService.updatePassword(userId, newPasswordHash);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Password changed successfully.',
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }
}
