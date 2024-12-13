import { MongoMemoryServer } from "mongodb-memory-server";
import { GenreService } from "./genre.service";
import { MongoClient } from "mongodb";
import { Model, Types, disconnect } from "mongoose";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { Genre, GenreDocument, GenreSchema } from "./entities/genre.entity";
import { CreateGenreDto } from "./dto/create-genre.dto";

describe('GenreService', () => {
    let gService: GenreService;
    let mongod: MongoMemoryServer;
    let mongoc: MongoClient;
    let genreModel: Model<GenreDocument>;

    const mockGenres = [
        {
            id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f8').toString(),
            name: 'House'
        },
        {
            id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f9').toString(),
            name: 'Techno'
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
                    { name: Genre.name, schema: GenreSchema },
                ])
            ],
            providers: [GenreService]
        }).compile();

        gService = app.get<GenreService>(GenreService);
        genreModel = app.get<Model<GenreDocument>>(getModelToken(Genre.name));

        mongoc = new MongoClient(uri);
        await mongoc.connect();
    });

    beforeEach(async () => {
        await mongoc.db('test').collection('genres').deleteMany({});

        const genre1 = new genreModel({
            ...mockGenres[0],
            _id: new Types.ObjectId(mockGenres[0].id),
        });

        const genre2 = new genreModel({
            ...mockGenres[1],
            _id: new Types.ObjectId(mockGenres[1].id),
        });

        await Promise.all([genre1.save(), genre2.save()]);
    });

    afterAll(async () => {
        await mongoc.close();
        await disconnect();
        await mongod.stop();
    });

    describe('findAll', () => {
        it('should return all genres', async () => {
            const results = await gService.findAll();
            expect(results).toHaveLength(2);
        });
    });

    describe('findOne', () => {
        it('should retrieve one genre', async () => {
            const result = await gService.findOne(mockGenres[0].id);
            expect(result).toHaveProperty('id', mockGenres[0].id);
            expect(result).toHaveProperty('name', mockGenres[0].name);
        });

        it('should return error when genre not found', async () => {
            await expect(gService.findOne('null')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a genre', async () => {
            const newGenre: CreateGenreDto = {
                name: 'Trance'
            };

            const result = await gService.create(newGenre);

            expect(result).toHaveProperty('_id');
            expect(result).toHaveProperty('name', newGenre.name);
        });
    });
});
