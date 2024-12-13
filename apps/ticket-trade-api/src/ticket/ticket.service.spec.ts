import { MongoMemoryServer } from "mongodb-memory-server";
import { TicketService } from "./ticket.service";
import { MongoClient } from "mongodb";
import { Model, Types, disconnect } from "mongoose";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { NotFoundException, ConflictException, ForbiddenException } from "@nestjs/common";
import { Ticket, TicketDocument, TicketSchema } from "./entities/ticket.entity";
import { Concert, ConcertDocument, ConcertSchema } from "../concert/entities/concert.entity";
import { User, UserDocument, UserSchema } from "../user/entities/user.entity";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { Neo4jService } from "../neo4j/neo4j.service";

describe('TicketService', () => {
    let tService: TicketService;
    let mongod: MongoMemoryServer;
    let mongoc: MongoClient;
    let ticketModel: Model<TicketDocument>;
    let concertModel: Model<ConcertDocument>;
    let userModel: Model<UserDocument>;
    let neo4jService: Neo4jService;

    const mockConcerts = [
        {
            id: new Types.ObjectId('6752fe61cd28cfa529d20c03').toString(),
            name: 'Coldplay - A Sky Full of Stars Tour',
            price: 100,
            startDateAndTime: new Date('2024-07-01T19:00:00.000Z'),
            endDateAndTime: new Date('2024-07-01T22:30:00.000Z'),
            amountTickets: 20000,
            artist: {
                id: new Types.ObjectId('6752fc1dcd28cfa529d20bf2').toString(),
                name: 'Coldplay',
                description: 'Coldplay is een Britse rockband',
                genre: {
                    id: new Types.ObjectId('6752fb78cd28cfa529d20be6').toString(),
                    name: 'R&B'
                }
            },
            location: {
                id: new Types.ObjectId('6752fc91cd28cfa529d20bfb').toString(),
                street: 'De Passage',
                houseNumber: '100',
                postalcode: '1101 AX',
                country: 'Netherlands',
                city: 'Amsterdam',
                name: 'Ziggo Dome'
            }
        }
    ];

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
                    { name: Ticket.name, schema: TicketSchema },
                    { name: Concert.name, schema: ConcertSchema },
                    { name: User.name, schema: UserSchema },
                ])
            ],
            providers: [TicketService, {
                provide: Neo4jService,
                useValue: {
                    getSession: jest.fn().mockReturnValue({
                        run: jest.fn().mockResolvedValue({ records: [] })
                    })
                }
            }]
        }).compile();

        tService = app.get<TicketService>(TicketService);
        ticketModel = app.get<Model<TicketDocument>>(getModelToken(Ticket.name));
        concertModel = app.get<Model<ConcertDocument>>(getModelToken(Concert.name));
        userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
        neo4jService = app.get<Neo4jService>(Neo4jService);

        mongoc = new MongoClient(uri);
        await mongoc.connect();
    });

    beforeEach(async () => {
        await mongoc.db('test').collection('tickets').deleteMany({});
        await mongoc.db('test').collection('concerts').deleteMany({});
        await mongoc.db('test').collection('users').deleteMany({});

        const concert1 = new concertModel({
            ...mockConcerts[0],
            _id: new Types.ObjectId(mockConcerts[0].id),
        });

        const user1 = new userModel({
            ...mockUsers[0],
            _id: new Types.ObjectId(mockUsers[0].id),
        });

        await Promise.all([concert1.save(), user1.save()]);
    });

    afterAll(async () => {
        await mongoc.close();
        await disconnect();
        await mongod.stop();
    });

    describe('create', () => {
        it('should create a ticket', async () => {
            const newTicket: CreateTicketDto = {
                concertId: mockConcerts[0].id
            };

            const result = await tService.create(mockUsers[0].id, newTicket);

            expect(result).toHaveProperty('_id');
            expect(result).toHaveProperty('concert');
            expect(result).toHaveProperty('userId', mockUsers[0].id);
        });
    });

    describe('findAll', () => {
        it('should return all tickets for a user', async () => {
            const result = await tService.findAll(mockUsers[0].id);
            expect(result).toHaveLength(0); // Initially empty
        });
    });

    describe('findOne', () => {
        it('should throw NotFoundException if ticket not found', async () => {
            await expect(tService.findOne(mockUsers[0].id, 'invalidId')).rejects.toThrow(NotFoundException);
        });
    });

    describe('scanTicket', () => {
        it('should mark ticket as used', async () => {
            const ticket = new ticketModel({
                concert: mockConcerts[0],
                userId: mockUsers[0].id,
                used: false
            });
            await ticket.save();

            const result = await tService.scanTicket(mockUsers[0].id, ticket._id.toString());

            expect(result).toHaveProperty('used', true);
        });

        it('should throw ForbiddenException if ticket is already used', async () => {
            const ticket = new ticketModel({
                concert: mockConcerts[0],
                userId: mockUsers[0].id,
                used: true
            });
            await ticket.save();

            await expect(tService.scanTicket(mockUsers[0].id, ticket._id.toString())).rejects.toThrow(ForbiddenException);
        });
    });
});
