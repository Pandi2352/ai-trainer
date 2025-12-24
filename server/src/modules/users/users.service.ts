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

    async findAll(query: any = {}): Promise<any> {
        const { page = 1, limit = 10, search, role } = query;
        const skip = (page - 1) * limit;
        const filter: any = {};

        if (role) filter.role = role;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const [users, total] = await Promise.all([
            this.userModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .exec(),
            this.userModel.countDocuments(filter).exec()
        ]);

        return {
            data: users,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / limit)
            }
        };
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

    async count(filter: any = {}): Promise<number> {
        return this.userModel.countDocuments(filter).exec();
    }
}
