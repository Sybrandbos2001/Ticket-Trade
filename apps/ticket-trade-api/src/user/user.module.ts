import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserController } from './user.controller';
import { Neo4jService } from '../neo4j/neo4j.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, Neo4jService],
  controllers: [UserController],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
