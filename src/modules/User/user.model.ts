import { TUser, UserModel } from "./user.interface";
import  bcrypt  from "bcrypt";
import { Schema, model } from 'mongoose';
import config from "../../config";

const userSchema = new Schema<TUser, UserModel>({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\d{10,15}$/, 'Please fill a valid phone number']
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    required: [true, "Role is required"],
    default: 'user'
  },
  address: {
    type: String,
    required: [true, "Address is required"]
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

userSchema.statics.isUserExistsByCustomEmail= async function(email: string){
  return await User.findOne({email});
    
}

userSchema.statics.isPasswordMatched = async function(planeTextPassword: string, hashTextPassword: string){
  return await bcrypt.compare(planeTextPassword, hashTextPassword);
  
}

export const User = model<TUser, UserModel>('User', userSchema);


