import mongoose from "mongoose";

const toConnect = async () => {
  try {
    const mongoDB = await mongoose.connect(process.env.MONGODB);
    if (mongoDB) {
      console.log(" db connection success");
    }
  } catch (error) {
    console.log("Error in connect", error.message);
  }
};

export default toConnect;
