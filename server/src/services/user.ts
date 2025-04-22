import UserModel, { IUser, UserRole } from "../models/user";
import { Types } from "mongoose";

export default class UserService {
  /**
   * Get user details by email
   */
  public async getUserDetails(email: string): Promise<any> {
    return await UserModel.findOne({ email: email });
  }

  /**
   * Get user by ID
   */
  public async getUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  /**
   * Update user's last login time
   */
  public async updateLastLogin(email: string): Promise<void> {
    await UserModel.updateOne(
      { email },
      { $set: { lastLogin: new Date() } }
    );
  }

  /**
   * Get all users
   */
  public async getAllUsers(): Promise<IUser[]> {
    return await UserModel.find().sort({ createdAt: -1 });
  }

  /**
   * Create a new user
   */
  public async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    return await user.save();
  }

  /**
   * Update user details
   */
  public async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(
      id,
      { $set: userData },
      { new: true }
    );
  }

  /**
   * Delete a user
   */
  public async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ _id: new Types.ObjectId(id) });
    return result.deletedCount > 0;
  }

  /**
   * Change user role
   */
  public async changeUserRole(id: string, role: UserRole): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(
      id,
      { $set: { role } },
      { new: true }
    );
  }
}
