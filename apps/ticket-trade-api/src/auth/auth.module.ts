import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { Neo4jService } from '../neo4j/neo4j.service';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' }
      })
    })
  ],
  providers: [AuthService, Neo4jService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
