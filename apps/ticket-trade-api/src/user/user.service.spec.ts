import { MongoMemoryServer } from "mongodb-memory-server";
import { UserService } from "./user.service";
import { MongoClient } from "mongodb";
import { Model, Types, disconnect } from "mongoose";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { User, UserDocument, UserSchema } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";

describe('UserService', () => {
    let userService: UserService;
    let mongod: MongoMemoryServer;
    let mongoc: MongoClient;
    let userModel: Model<UserDocument>;

    const mockUsers = [
        {
            id: new Types.ObjectId('675b0726ab109a95b7b1e89b').toString(),
            name: 'Juud',
            lastname: 'Verhoeven',
            username: 'Juud',
            phone: '+31 6 12345678',
            email: 'sybrandbos1@gmail.com',
            password: '$2b$10$JUKAgS1PCEJX2X0/s07fTuqxOgWvP.ObuQlSQ./.jAeI.EgHi49RG',
            role: 'user',
            following: [],
            tickets: []
        }
    ];

    beforeAll(async () => {
        let uri = '';

        const app = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => {
                        mongod = await MongoMemoryServer.create();
                        uri = mongod.getUri();
                        return { uri };
                    }
                }),
                MongooseModule.forFeature([
                    { name: User.name, schema: UserSchema },
                ])
            ],
            providers: [UserService]
        }).compile();

        userService = app.get<UserService>(UserService);
        userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

        mongoc = new MongoClient(uri);
        await mongoc.connect();
    });

    beforeEach(async () => {
        await mongoc.db('test').collection('users').deleteMany({});

        const user1 = new userModel({
            ...mockUsers[0],
            _id: new Types.ObjectId(mockUsers[0].id),
        });

        await user1.save();
    });

    afterAll(async () => {
        await mongoc.close();
        await disconnect();
        await mongod.stop();
    });

    describe('findAll', () => {
        it('should return all users with selected fields', async () => {
            const results = await userService.findAll();
            expect(results).toHaveLength(1);
            expect(results[0]).toHaveProperty('name', mockUsers[0].name);
            expect(results[0]).toHaveProperty('lastname', mockUsers[0].lastname);
        });
    });

    describe('findUserByField', () => {
        it('should find a user by ID', async () => {
            const result = await userService.findUserByField('id', mockUsers[0].id);
            expect(result).toHaveProperty('id', mockUsers[0].id);
        });

        it('should throw NotFoundException for invalid ID', async () => {
            await expect(userService.findUserByField('id', 'invalidId')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a user with full DTO', async () => {
            const updateUserDto: UpdateUserDto = {
                name: 'John',
                lastname: 'Doe',
                phone: '+31 6 98765432',
            };

            const result = await userService.update(mockUsers[0].id, updateUserDto);

            expect(result).toHaveProperty('name', updateUserDto.name);
            expect(result).toHaveProperty('lastname', updateUserDto.lastname);
            expect(result).toHaveProperty('phone', updateUserDto.phone);
        });
    });

    describe('getAccount', () => {
        it('should return user account details', async () => {
            const result = await userService.getAccount(mockUsers[0].id);
            expect(result).toHaveProperty('name', mockUsers[0].name);
            expect(result).toHaveProperty('email', mockUsers[0].email);
        });

        it('should throw NotFoundException for invalid user ID', async () => {
            await expect(userService.getAccount('invalidId')).rejects.toThrow(NotFoundException);
        });
    });

    describe('getProfile', () => {
        it('should return user profile by ID', async () => {
            const result = await userService.getProfile('id', mockUsers[0].id);
            expect(result).toHaveProperty('username', mockUsers[0].username);
        });

        it('should throw NotFoundException for invalid ID', async () => {
            await expect(userService.getProfile('id', 'invalidId')).rejects.toThrow(NotFoundException);
        });
    });

    describe('getProfileBySearch', () => {
        it('should return users matching the search query', async () => {
            const result = await userService.getProfileBySearch('Juud');
            expect(result).toHaveLength(1);
            expect(result[0]).toHaveProperty('name', mockUsers[0].name);
        });

        it('should throw NotFoundException if no users match the search query', async () => {
            await expect(userService.getProfileBySearch('InvalidName')).rejects.toThrow(NotFoundException);
        });
    });
});
