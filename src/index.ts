import { createConnection, Connection } from "typeorm";
import { Post } from "./entity/Post";
import { Category } from "./entity/Category";
import { User } from "./entity/User";

async function dataMapper(connection: Connection) {
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
}

async function activeRecord(connectin: Connection) {
  const user = new User();
  user.firstName = "Timber";
  user.lastName = "Saw";
  user.age = 25;
  await user.save();

  const allUsers = await User.find();
  const firstUser = await User.findOne(1);
  const timber = await User.findOne({ firstName: "Timber", lastName: "Saw" });

  await timber.remove();
}

(async () => {
  try {
    const connectin = await createConnection();
    // await dataMapper(connectin);
    await activeRecord(connectin);
  } catch (error) {
    console.log("Error: ", error);
  }
})();

// connection settings are in the "ormconfig.json" file
//   .then(async (connection) => {})
//   .catch((error) => console.log("Error: ", error));
