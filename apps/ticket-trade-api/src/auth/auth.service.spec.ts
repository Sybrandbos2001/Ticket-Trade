import { MongoMemoryServer } from "mongodb-memory-server";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { MongoClient } from "mongodb";
import { Model, Types, disconnect } from "mongoose";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { User, UserDocument, UserSchema } from "../user/entities/user.entity";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { Neo4jService } from "../neo4j/neo4j.service";
import { Role } from "@ticket-trade/domain";

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    let jwtService: JwtService;
    let neo4jService: Neo4jService;
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
            role: Role.USER,
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
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        findUserByField: jest.fn().mockImplementation((field, value) => {
                            const user = mockUsers.find((u) => u.email === value);
                            if (!user) {
                                throw new NotFoundException(`User with ${field} ${value} not found`);
                            }
                            return user;
                        })
                    }
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn().mockResolvedValue('mocked-token')
                    }
                },
                {
                    provide: Neo4jService,
                    useValue: {
                        getSession: jest.fn().mockReturnValue({
                            run: jest.fn().mockResolvedValue({})
                        })
                    }
                }
            ]
        }).compile();

        authService = app.get<AuthService>(AuthService);
        userService = app.get<UserService>(UserService);
        jwtService = app.get<JwtService>(JwtService);
        neo4jService = app.get<Neo4jService>(Neo4jService);
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

    describe('register', () => {
        it('should register a new user and return the user without password', async () => {
            const registerDto: RegisterDto = {
                name: 'John',
                lastname: 'Doe',
                username: 'JohnDoe',
                phone: '+31 6 87654321',
                email: 'johndoe@gmail.com',
                password: 'Password@123',
                role: Role.USER,
                tickets: [],
                following: []
            };

            const result = await authService.register(registerDto);

            expect(result).toHaveProperty('name', registerDto.name);
            expect(result).not.toHaveProperty('password');
        });

        it('should throw ConflictException for duplicate email', async () => {
            const registerDto: RegisterDto = {
                name: mockUsers[0].name,
                lastname: mockUsers[0].lastname,
                username: mockUsers[0].username,
                phone: mockUsers[0].phone,
                email: mockUsers[0].email,
                password: 'Password@123',
                role: Role.USER,
                tickets: [],
                following: []
            };

            await expect(authService.register(registerDto)).rejects.toThrow(ConflictException);
        });
    });
});
