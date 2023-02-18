import mongoose from "mongoose";

const connectDatabase = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.DB_LOCAL_URI).then((con) => {
    console.log(`MongoDB Database connected with host: ${con.connection.host}`);
  });
};

export default connectDatabase;
