import { TUser } from "./user.interface";
import  bcrypt  from "bcrypt";
import { Schema, model } from 'mongoose';
import config from "../../config";

const userSchema = new Schema<TUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10,15}$/, 'Please fill a valid phone number']
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    required: true,
    default: 'user'
  },
  address: {
    type: String,
    required: true
  }
});

userSchema.pre('save',async function(next){
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this
    //hashing password and save into DB
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    )
    next();
  })
  
  //set '' after saving password
  userSchema.post('save', function(doc, next){
    console.log(this, 'post hook: We saved our data');
    doc.password=''
    next();
  })



export const User = model<TUser>('User', userSchema);


