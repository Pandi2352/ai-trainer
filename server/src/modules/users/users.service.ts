import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: any): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async findOne(email: string): Promise<User | undefined> {
        const user = await this.userModel.findOne({ email }).exec();
        return user ? (user.toObject() as User) : undefined;
    }

    async findById(id: string): Promise<User | undefined> {
        const user = await this.userModel.findById(id).exec();
        return user ? (user.toObject() as User) : undefined;
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async update(id: string, updateData: any): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return updatedUser.toObject() as User;
    }

    async setPassword(id: string, hash: string): Promise<User> {
        return this.update(id, { password: hash });
    }
}
