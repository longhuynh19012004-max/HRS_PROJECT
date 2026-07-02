import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '19012004', 
    });
  }

  async validate(payload: any) {
    // 👇 SỬA TẠI ĐÂY: Đổi payload.systemRole thành payload.role
    return { 
      userId: payload.sub, 
      email: payload.email, 
      role: payload.role 
    };
  }
}