import { MongoMemoryServer } from "mongodb-memory-server";
import { LocationService } from "./location.service";
import { MongoClient } from "mongodb";
import { Model, Types, disconnect } from "mongoose";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { Location, LocationDocument, LocationSchema } from "./entities/location.entity";
import { CreateLocationDto } from "./dto/create-location.dto";

describe('LocationService', () => {
    let lService: LocationService;
    let mongod: MongoMemoryServer;
    let mongoc: MongoClient;
    let locationModel: Model<LocationDocument>;

    const mockLocations = [
        {
            id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f8').toString(),
            street: 'Kerkstraat',
            houseNumber: '1A',
            postalcode: '4811AB',
            city: 'Arnhem',
            country: 'Nederland',
            name: 'GelreDome'
        },
        {
            id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f9').toString(),
            street: 'Kalverstraat',
            houseNumber: '10',
            postalcode: '1012NX',
            city: 'Amsterdam',
            country: 'Nederland',
            name: 'Dam Square'
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
                    { name: Location.name, schema: LocationSchema },
                ])
            ],
            providers: [LocationService]
        }).compile();

        lService = app.get<LocationService>(LocationService);
        locationModel = app.get<Model<LocationDocument>>(getModelToken(Location.name));

        mongoc = new MongoClient(uri);
        await mongoc.connect();
    });

    beforeEach(async () => {
        await mongoc.db('test').collection('locations').deleteMany({});

        const location1 = new locationModel({
            ...mockLocations[0],
            _id: new Types.ObjectId(mockLocations[0].id),
        });

        const location2 = new locationModel({
            ...mockLocations[1],
            _id: new Types.ObjectId(mockLocations[1].id),
        });

        await Promise.all([location1.save(), location2.save()]);
    });

    afterAll(async () => {
        await mongoc.close();
        await disconnect();
        await mongod.stop();
    });

    describe('findAll', () => {
        it('should return all locations', async () => {
            const results = await lService.findAll();
            expect(results).toHaveLength(2);
        });
    });

    describe('findOne', () => {
        it('should retrieve one location', async () => {
            const result = await lService.findOne(mockLocations[0].id);
            expect(result).toHaveProperty('id', mockLocations[0].id);
            expect(result).toHaveProperty('street', mockLocations[0].street);
            expect(result).toHaveProperty('city', mockLocations[0].city);
        });

        it('should return error when location not found', async () => {
            await expect(lService.findOne('null')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a location', async () => {
            const newLocation: CreateLocationDto = {
                street: 'Nieuwe straat',
                houseNumber: '2B',
                postalcode: '1234AB',
                city: 'Utrecht',
                country: 'Nederland',
                name: 'Beatrix Theater'
            };

            const result = await lService.create(newLocation);

            expect(result).toHaveProperty('_id');
            expect(result).toHaveProperty('street', newLocation.street);
            expect(result).toHaveProperty('name', newLocation.name);
        });
    });
});
