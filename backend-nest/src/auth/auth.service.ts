import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!user) return null;

    // Map role name, fallback to customer if none found
    const role = user.user_roles[0]?.roles?.name || 'customer';

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      created_at: user.created_at,
      role,
    };
  }

  async create(name: string, email: string, phone: string, passwordHash: string) {
    return this.prisma.users.create({
      data: {
        name,
        email,
        phone,
        password_hash: passwordHash,
        status: 'active',
      },
    });
  }

  async assignRole(userId: number, roleId: number) {
    return this.prisma.user_roles.create({
      data: {
        user_id: userId,
        role_id: roleId,
      },
    });
  }

  async createLoyaltyRecord(userId: number) {
    return this.prisma.customer_loyalty.create({
      data: {
        user_id: userId,
        current_points: 0,
        lifetime_points: 0,
        membership_tier_id: 1,
      },
    });
  }

  async getUserLoyalty(userId: number) {
    const loyalty = await this.prisma.customer_loyalty.findUnique({
      where: { user_id: userId },
      include: {
        membership_tiers: true,
      },
    });

    if (!loyalty) return null;

    return {
      current_points: loyalty.current_points,
      lifetime_points: loyalty.lifetime_points,
      tier_name: loyalty.membership_tiers?.name || null,
      discount_percentage: loyalty.membership_tiers?.discount_percentage ? Number(loyalty.membership_tiers.discount_percentage) : 0,
      min_points: loyalty.membership_tiers?.min_points || 0,
    };
  }

  async updateProfile(id: number, name: string, email: string, phone: string) {
    return this.prisma.users.update({
      where: { id },
      data: { name, email, phone },
    });
  }

  async updatePassword(id: number, passwordHash: string) {
    return this.prisma.users.update({
      where: { id },
      data: { password_hash: passwordHash },
    });
  }
}
