
import { MongoMemoryServer } from "mongodb-memory-server";
import { ArtistService } from "./artist.service"
import { MongoClient } from "mongodb";
import { Model, Types, disconnect } from "mongoose";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { Artist, ArtistDocument, ArtistSchema } from "./entities/artist.entity";
import { IArtist, IGenre } from "@ticket-trade/domain";
import { Genre, GenreDocument, GenreSchema } from "../genre/entities/genre.entity";
import { GenreService } from "../genre/genre.service";

describe('ArtistService', () => {
    let aService: ArtistService;
    let mongod: MongoMemoryServer;
    let mongoc: MongoClient;
    let artistModel: Model<ArtistDocument>;
    let genreModel: Model<GenreDocument>;


    const mockGenres: IGenre[] = [
      {
        id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f8').toString(),
        name: 'EDM',
      },
      {
        id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f9').toString(),
        name: 'Dubstep',
    },
  ]

    const mockArtists: IArtist[] = [
        {
            id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f8').toString(),
            name: 'Artist 1',
            genre: mockGenres[0],
            description: 'hello w113',
        },
        {
            id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f9').toString(),
            name: 'Artist 2',
            genre: mockGenres[0],
            description: 'hello w113',
        }
    ]

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
                    { name: Artist.name, schema: ArtistSchema },
                ])
            ],
            providers: [ArtistService, GenreService]
        }).compile();

        aService = app.get<ArtistService>(ArtistService);
        artistModel = app.get<Model<ArtistDocument>>(getModelToken(Artist.name));
        genreModel = app.get<Model<GenreDocument>>(getModelToken(Genre.name));


        mongoc = new MongoClient(uri);
        await mongoc.connect();
    });

    beforeEach(async () => {
      await mongoc.db('test').collection('artists').deleteMany({});
      await mongoc.db('test').collection('genres').deleteMany({});
      
      const artist1 = new artistModel({
        ...mockArtists[0],
        _id: new Types.ObjectId(mockArtists[0].id),
        genre: {
          ...mockGenres[0],
          _id: new Types.ObjectId(mockGenres[0].id),
        },
      });

      const artist2 = new artistModel({
        ...mockArtists[1],
        _id: new Types.ObjectId(mockArtists[1].id),
        genre: {
          ...mockGenres[0],
          _id: new Types.ObjectId(mockGenres[0].id),
        },
      });

      const genre1 = new genreModel({
        ...mockGenres[0],
        _id: new Types.ObjectId(mockGenres[0].id),
        name: mockGenres[0].name,
      });
      
      const genre2 = new genreModel({
        ...mockGenres[1],
        _id: new Types.ObjectId(mockGenres[1].id),
        name: mockGenres[1].name,
      });
    
      await Promise.all([artist1.save(), artist2.save(), genre1.save(), genre2.save()]);
    });

    afterAll(async () => {
        await mongoc.close();
        await disconnect();
        await mongod.stop();
    });

    describe('findAll', () => {
        it('should return all artists', async () => {
            //arrange

            //act
            const results = await aService.findAll();

            //assert
            expect(results).toHaveLength(2);
        });
    });

    describe('getOne', () => {
      it('should retrieve one artist', async () => {
        const result = await aService.findOne(mockArtists[0].id);
        expect(result).toHaveProperty('id', mockArtists[0].id);
        expect(result).toHaveProperty('name', mockArtists[0].name);
        expect(result).toHaveProperty('description', mockArtists[0].description);
      });

        it('should return error when artist not found', async () => {
            //arrange

            //act & assert
            await expect(aService.findOne('null')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
      it('should create an artist', async () => {
        // Arrange
        const newArtist = {
          name: 'Artist 3',
          genreId: mockGenres[0].id,
          description: 'Description 3',
        };
    
        // Act
        const result = await aService.create(newArtist);
    
        // Assert
        expect(result).toHaveProperty('_id');
        expect(result).toHaveProperty('name', newArtist.name);
        expect(result).toHaveProperty('description', newArtist.description);
        expect(result).toHaveProperty('genre');
      });
    });
  });