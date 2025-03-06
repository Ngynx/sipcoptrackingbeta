import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
    _id: true,
    timestamps: true,
    toJSON: {
        getters: true,
        virtuals: true
    }
})
class User {

    @Prop({
        type: String,
    })
    user_name: string;

    @Prop({
        type: String,
    })
    user_lastname: string;

    @Prop({
        type: String,
    })
    user_username: string;

    @Prop({
        type: Number,
        unique: true
    })
    user_document_number: number;

    @Prop({
        type: Number,
    })
    user_cellphone_number: number;
    
    @Prop({
        type: String,
        unique: true
    })
    user_email: string;

    @Prop({
        type: String,
    })
    user_password: string;

    @Prop({
        type: String,
    })
    user_address: string;

    @Prop({
        type: Boolean,
        default: false
    })
    user_is_root: boolean;

    @Prop({
        type: Boolean,
        default: false
    })
    user_is_admin: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', async function (next) {
    // if (!this.isModified('user_password')) return next();
    // const pass_hashed: string = await newHash(this.get('user_password'));
    // await this.set('user_password', pass_hashed);
    // return next();
});
export const UserModel = model<UserDocument>(User.name, UserSchema);