import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.model';
import { jwtConstants } from './constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel('User') private userModel: Model<User> 
      ) 
       {
    super({
      jwtFromRequest: (req) => req?.cookies?.jwt || null, // Extract token from cookies
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    console.log("payload:"+payload);
    console.log(payload.sub);
    const user = await this.userModel.findById(payload.sub).exec(); // ✅ Use `userModel`

    if (!user) {
      throw new Error('User not found');
    }

    return { userId: user._id, email: user.email, role: user.role };
  }
}
