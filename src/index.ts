import { createConnection, Connection } from "typeorm";
import { Post } from "./entity/Post";
import { Category } from "./entity/Category";
import { User } from "./entity/User";
import { Photo } from "./entity/Photo";
import { PhotoMetadata } from "./entity/PhotoMetadata";
import { Author } from "./entity/Author";
import { Album } from "./entity/Album";

// TODO:
// 1. select by TypeORM
// 2. select related data
// 3. chain relation query ?

let connection: Connection;

async function testQueryBuilder() {
  let photos = await connection
    .getRepository(Photo)
    .createQueryBuilder("photo") // first argument is an alias. Alias is what you are selecting - photos. You must specify it.
    // .innerJoinAndSelect("photo.metadata", "metadata")
    .leftJoinAndSelect("photo.albums", "album")
    .where("photo.isPublished = true")
    // TODO: andWhere will result in no data, why?
    // .andWhere("(photo.name = :photoName OR photo.name = :bearName)")
    .orderBy("photo.id", "DESC")
    .skip(5)
    .take(10)
    .setParameters({ photoName: "My", bearName: "Me and Bears6" })
    .getMany();
  console.log("done");
}

async function testManyToMany() {
  // create a few albums
  let album1 = new Album();
  album1.name = "Bears";
  await connection.manager.save(album1);

  let album2 = new Album();
  album2.name = "Me6";
  await connection.manager.save(album2);

  // create a few photos
  let photo = new Photo();
  photo.name = "Me and Bears6";
  photo.description = "I am near polar bears5";
  photo.filename = "photo-with-bears5.jpg";
  photo.albums = [album1, album2];
  photo.isPublished = true;
  await connection.manager.save(photo);

  // now our photo is saved and albums are attached to it
  // now lets load them:
  const loadedPhoto = await connection
    .getRepository(Photo)
    .findOne({ name: "Me and Bears6" }, { relations: ["albums"] });

  const loadedAlbums = await connection
    .getRepository(Album)
    .findOne({ name: "Me6" }, { relations: ["photos"] });
}

async function testOneToMany() {
  /**
   * save: 2 ways. either author.photos or assign per photo.author
   */
  const author = new Author();
  author.name = "John";
  await connection.manager.save(author);

  const photo1 = new Photo();
  photo1.name = "me11.jpg";
  photo1.description = "I am near polar bears1";
  photo1.filename = "photo-with-bears1.jpg";
  photo1.isPublished = true;
  photo1.author = author;
  await connection.manager.save(photo1);

  const photo2 = new Photo();
  photo2.name = "me-and-bears22.jpg";
  photo2.description = "I am near polar bears2";
  photo2.filename = "photo-with-bears2.jpg";
  photo2.isPublished = true;
  photo2.author = author;
  await connection.manager.save(photo2);

  /**
   * read
   */

  const authorRepository = connection.getRepository(Author);
  const authors = await authorRepository.find({ relations: ["photos"] });

  // or from inverse side

  const photoRepository = connection.getRepository(Photo);
  const photos = await photoRepository.find({ relations: ["author"] });

  const authors2 = await connection
    .getRepository(Author)
    .createQueryBuilder("author")
    .leftJoinAndSelect("author.photos", "photo")
    .getMany();

  // or from inverse side

  const photos2 = await connection
    .getRepository(Photo)
    .createQueryBuilder("photo")
    .leftJoinAndSelect("photo.author", "author")
    .getMany();
}

// using https://typeorm.io/#/undefined/inverse-side-of-the-relationship
// sql'join is = mongo's lookup
// https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#pipe._S_lookup
async function testReadOneToOne() {
  /** 1. way */
  // in photoMeta, save and setup its foreign key as photo's primary key
  console.log("one to one relationship query");

  const photoMetaRepository = connection.getRepository(PhotoMetadata);
  const photoMetas = await photoMetaRepository.find({ relations: ["photo"] });

  /** 2. way */
  // 1. no these returned objects in mongoose's population,
  // in mongoose, only photoMetaData.photo.
  // it is more like innerjoin but like table2.table1 (table2 has set foreign key)
  // so in monogoose, we need to organize the retunred data as photos.metadata after querying
  // 2. in mongo' raw lookup query, is ok (since just array data return)
  console.log("inverse-side-of-the-relationship query");

  let photoRepository = connection.getRepository(Photo);
  // left Join
  let photos = await photoRepository.find({ relations: ["metadata"] });

  /** 3. way */
  // no this in mongoose
  console.log("query builder");

  // INNER JOIN
  let photos2 = await connection
    .getRepository(Photo)
    .createQueryBuilder("photo")
    .innerJoinAndSelect("photo.metadata", "metadata")
    .getMany();
}

async function testSaveOneToOne() {
  // create a photo
  let photo = new Photo();
  photo.name = "Me and Bears23";
  photo.description = "I am near polar bears2";
  photo.filename = "photo-with-bears2.jpg";
  photo.isPublished = true;

  // create a photo metadata
  let metadata = new PhotoMetadata();
  metadata.height = 1640;
  metadata.width = 1480;
  metadata.compressed = true;
  metadata.comment = "cybershoot2";
  metadata.orientation = "portait2";
  // metadata.photo = photo; // this way we connect them

  // auto save metada.phto -> only works in cascade mode,
  // not like one to many <- saving on either side is ok without cascade setting
  photo.metadata = metadata;

  // get entity repositories
  let photoRepository = connection.getRepository(Photo);
  let metadataRepository = connection.getRepository(PhotoMetadata);

  // first we should save a photo
  await photoRepository.save(photo);

  // photo is saved. Now we need to save a photo metadata
  await metadataRepository.save(metadata);

  // done
  console.log("Photo is saved, photo metadata is saved too.");
}

// data mapper pattern
// from https://github.com/grimmer0125/typeorm-example
async function testManyToMany1() {
  const category1 = new Category();
  category1.name = "TypeScript";
  await connection.manager.save(category1);

  const category2 = new Category();
  category2.name = "Programming";
  await connection.manager.save(category2);

  const post = new Post();
  post.title = "Control flow based type analysis";
  post.text = `TypeScript 2.0 implements a control flow-based type analysis for local variables and parameters.`;
  post.categories = [category1, category2];

  await connection.manager.save(post);
  console.log("Post has been saved: ", post);

  const firstPost = await connection.manager.findOne(Post, 1); // find by id
  let categoryRepository = connection.getRepository(Category);
  const [allCategory, categoryCount] = await categoryRepository.findAndCount();
  console.log("testManyToMany done");
}

async function testActiveRecord(connectin: Connection) {
  console.log("start activeRecord test");
  const user = new User();
  user.firstName = "Timber";
  user.lastName = "Saw";
  user.age = 25;
  user.price = 10;
  await user.save();

  const allUsers = await User.find();
  console.log(allUsers.length);
  const firstUser = await User.findOne(8); // id:8
  console.log(firstUser);
  const timber = await User.findOne({ firstName: "Timber", lastName: "Saw" });
  await timber.remove();

  console.log("tes activeRecord test ");
}

(async () => {
  try {
    console.log("start connection");
    connection = await createConnection();
    console.log("connection is ok");

    await testQueryBuilder();

    // await testManyToMany();

    // await testOneToMany();

    // await testSaveOneToOne();
    // await testReadOneToOne();

    // await testManyToMany1(connectin);

    // await testActiveRecord(connectin);
    console.log("program is finished");
  } catch (error) {
    console.log("Error: ", error);
  }
})();
