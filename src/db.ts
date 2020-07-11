import * as mongoose from 'mongoose';
require('dotenv').config();

mongoose
  .connect(
    'mongodb+srv://koftov:koftovkoftov@cluster0-4e7ky.mongodb.net/tasks?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));
