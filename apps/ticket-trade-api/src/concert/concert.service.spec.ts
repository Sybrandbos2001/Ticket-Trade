import { MongoMemoryServer } from "mongodb-memory-server";
import { ConcertService } from "./concert.service";
import { MongoClient } from "mongodb";
import { Model, Types, disconnect } from "mongoose";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { Concert, ConcertDocument, ConcertSchema } from "./entities/concert.entity";
import { Artist, ArtistDocument, ArtistSchema } from "../artist/entities/artist.entity";
import { Location, LocationDocument, LocationSchema } from "../location/entities/location.entity";
import { CreateConcertDto } from "./dto/create-concert.dto";
import { Neo4jService } from "../neo4j/neo4j.service";

describe('ConcertService', () => {
    let cService: ConcertService;
    let mongod: MongoMemoryServer;
    let mongoc: MongoClient;
    let concertModel: Model<ConcertDocument>;
    let artistModel: Model<ArtistDocument>;
    let locationModel: Model<LocationDocument>;
    let neo4jService: Neo4jService;

    const mockArtists = [
        {
            id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f8').toString(),
            name: 'Artist 1',
            genre: { id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f7').toString(), name: 'Rock' },
            description: 'Artist 1 description',
        },
        {
            id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f9').toString(),
            name: 'Artist 2',
            genre: { id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f6').toString(), name: 'Jazz' },
            description: 'Artist 2 description',
        }
    ];

    const mockLocations = [
        {
            id: new Types.ObjectId('5e9c8d19ed1d9c001783b7a0').toString(),
            street: 'Main Street',
            houseNumber: '123',
            postalcode: '12345',
            city: 'Cityville',
            country: 'Countryland',
            name: 'Big Venue'
        },
        {
            id: new Types.ObjectId('5e9c8d19ed1d9c001783b7a1').toString(),
            street: 'Second Street',
            houseNumber: '456',
            postalcode: '67890',
            city: 'Townsville',
            country: 'Countryland',
            name: 'Small Venue'
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
                    { name: Concert.name, schema: ConcertSchema },
                    { name: Artist.name, schema: ArtistSchema },
                    { name: Location.name, schema: LocationSchema },
                ])
            ],
            providers: [ConcertService, {
                provide: Neo4jService,
                useValue: {
                    getSession: jest.fn().mockReturnValue({
                        run: jest.fn().mockResolvedValue({ records: [] })
                    })
                }
            }]
        }).compile();

        cService = app.get<ConcertService>(ConcertService);
        concertModel = app.get<Model<ConcertDocument>>(getModelToken(Concert.name));
        artistModel = app.get<Model<ArtistDocument>>(getModelToken(Artist.name));
        locationModel = app.get<Model<LocationDocument>>(getModelToken(Location.name));
        neo4jService = app.get<Neo4jService>(Neo4jService);

        mongoc = new MongoClient(uri);
        await mongoc.connect();
    });

    beforeEach(async () => {
        await mongoc.db('test').collection('concerts').deleteMany({});
        await mongoc.db('test').collection('artists').deleteMany({});
        await mongoc.db('test').collection('locations').deleteMany({});

        const artist1 = new artistModel({
            ...mockArtists[0],
            _id: new Types.ObjectId(mockArtists[0].id),
        });

        const artist2 = new artistModel({
            ...mockArtists[1],
            _id: new Types.ObjectId(mockArtists[1].id),
        });

        const location1 = new locationModel({
            ...mockLocations[0],
            _id: new Types.ObjectId(mockLocations[0].id),
        });

        const location2 = new locationModel({
            ...mockLocations[1],
            _id: new Types.ObjectId(mockLocations[1].id),
        });

        await Promise.all([artist1.save(), artist2.save(), location1.save(), location2.save()]);
    });

    afterAll(async () => {
        await mongoc.close();
        await disconnect();
        await mongod.stop();
    });

    describe('findAll', () => {
        it('should return all concerts', async () => {
            const results = await cService.findAll();
            expect(results).toHaveLength(0); // Initially empty
        });
    });

    describe('create', () => {
        it('should create a concert', async () => {
            const newConcert: CreateConcertDto = {
                name: 'Post Malone Concert',
                price: 100.0,
                startDateAndTime: new Date('2024-12-15T19:30:00Z'),
                endDateAndTime: new Date('2024-12-15T22:30:00Z'),
                amountTickets: 5000,
                locationId: mockLocations[0].id,
                artistId: mockArtists[0].id
            };

            const result = await cService.create(newConcert);

            expect(result).toHaveProperty('_id');
            expect(result).toHaveProperty('name', newConcert.name);
            expect(result).toHaveProperty('price', newConcert.price);
        });
    });
});
