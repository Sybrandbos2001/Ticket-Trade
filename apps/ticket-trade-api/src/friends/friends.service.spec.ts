import { MongoMemoryServer } from "mongodb-memory-server";
import { FriendsService } from "./friends.service";
import { UserService } from "../user/user.service";
import { MongoClient } from "mongodb";
import { Model, Types, disconnect } from "mongoose";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { User, UserDocument, UserSchema } from "../user/entities/user.entity";
import { Neo4jService } from "../neo4j/neo4j.service";

describe('FriendsService', () => {
    let friendsService: FriendsService;
    let userService: UserService;
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
            role: 'user',
            following: [],
            tickets: []
        },
        {
            id: new Types.ObjectId('675b0726ab109a95b7b1e89c').toString(),
            name: 'John',
            lastname: 'Doe',
            username: 'JohnDoe',
            phone: '+31 6 87654321',
            email: 'johndoe@gmail.com',
            password: '$2b$10$JUKAgS1PCEJX2X0/s07fTuqxOgWvP.ObuQlSQ./.jAeI.EgHi49RG',
            role: 'user',
            following: [new Types.ObjectId('675b0726ab109a95b7b1e89b')],
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
            providers: [
                FriendsService,
                {
                    provide: Neo4jService,
                    useValue: {
                        getSession: jest.fn().mockReturnValue({
                            run: jest.fn().mockResolvedValue({ records: [] })
                        })
                    }
                },
                {
                    provide: UserService,
                    useValue: {
                        getProfile: jest.fn().mockImplementation((field, value) => {
                            const user = mockUsers.find((u) => u.id === value);
                            if (!user) {
                                throw new NotFoundException(`User with ${field} ${value} not found`);
                            }
                            return user;
                        })
                    }
                }
            ]
        }).compile();

        friendsService = app.get<FriendsService>(FriendsService);
        userService = app.get<UserService>(UserService);
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

        const user2 = new userModel({
            ...mockUsers[1],
            _id: new Types.ObjectId(mockUsers[1].id),
        });

        await Promise.all([user1.save(), user2.save()]);
    });

    afterAll(async () => {
        await mongoc.close();
        await disconnect();
        await mongod.stop();
    });

    describe('followUser', () => {
        it('should allow a user to follow another user', async () => {
            await friendsService.followUser(mockUsers[0].id, mockUsers[1].id);

            const user = await userModel.findById(mockUsers[0].id).lean();
            const following = user.following.map((id) => id.toString());
            expect(following).toContain(mockUsers[1].id);
        });
    });

    describe('unfollowUser', () => {
        it('should allow a user to unfollow another user', async () => {
            await friendsService.unfollowUser(mockUsers[1].id, mockUsers[0].id);

            const user = await userModel.findById(mockUsers[1].id).lean();
            const following = user.following.map((id) => id.toString());
            expect(following).not.toContain(mockUsers[0].id);
        });
    });
});
