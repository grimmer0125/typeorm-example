import { createConnection, Connection } from "typeorm";
import { Post } from "./entity/Post";
import { Category } from "./entity/Category";
import { User } from "./entity/User";
import { Photo } from "./entity/Photo";
import { PhotoMetadata } from "./entity/PhotoMetadata";

// data mapper pattern
async function testManyToMany(connection: Connection) {
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
  console.log("tes1 done");
}

async function testOneToOne(connection: Connection) {
  // create a photo
  let photo = new Photo();
  photo.name = "Me and Bears";
  photo.description = "I am near polar bears";
  photo.filename = "photo-with-bears.jpg";
  photo.isPublished = true;

  // create a photo metadata
  let metadata = new PhotoMetadata();
  metadata.height = 640;
  metadata.width = 480;
  metadata.compressed = true;
  metadata.comment = "cybershoot";
  metadata.orientation = "portait";
  metadata.photo = photo; // this way we connect them

  // get entity repositories
  let photoRepository = connection.getRepository(Photo);
  let metadataRepository = connection.getRepository(PhotoMetadata);

  // first we should save a photo
  await photoRepository.save(photo);

  // photo is saved. Now we need to save a photo metadata
  await metadataRepository.save(metadata);

  // done
  console.log(
    "Metadata is saved, and relation between metadata and photo is created in the database too"
  );
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
    const connectin = await createConnection();
    // await testManyToMany(connectin);
    // await testActiveRecord(connectin);
    await testOneToOne(connectin);
    console.log("program is finished");
  } catch (error) {
    console.log("Error: ", error);
  }
})();
