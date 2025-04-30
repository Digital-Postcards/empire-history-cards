import UserModel, { IUser, UserRole } from "../models/user";
import { Types } from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10; // Standard recommendation for bcrypt

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
    try {
      // Try to find by MongoDB ObjectId if it's valid
      if (Types.ObjectId.isValid(id)) {
        const user = await UserModel.findById(id);
        if (user) {
          return user;
        }
      }
      
      // If not found by ObjectId or not a valid ObjectId, try by custom id field
      return await UserModel.findOne({ id: id });
    } catch (error) {
      console.error("Error in getUserById service:", error);
      throw error;
    }
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
   * Hash a password
   * @private
   */
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Create a new user with hashed password
   */
  public async createUser(userData: Partial<IUser>): Promise<IUser> {
    // Hash the password before saving
    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }
    
    const user = new UserModel(userData);
    return await user.save();
  }

  /**
   * Update user details, hashing password if provided
   */
  public async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    try {
      // If password is being updated, hash it
      if (userData.password) {
        userData.password = await this.hashPassword(userData.password);
      }
      
      // Try to update by MongoDB ObjectId if it's valid
      if (Types.ObjectId.isValid(id)) {
        const user = await UserModel.findByIdAndUpdate(
          id,
          { $set: userData },
          { new: true }
        );
        
        if (user) {
          return user;
        }
      }
      
      // If not updated by ObjectId or not a valid ObjectId, try by custom id field
      return await UserModel.findOneAndUpdate(
        { id: id },
        { $set: userData },
        { new: true }
      );
    } catch (error) {
      console.error("Error in updateUser service:", error);
      throw error;
    }
  }

  /**
   * Delete a user
   */
  public async deleteUser(id: string): Promise<boolean> {
    try {
      // First try to find by MongoDB ObjectId if it's a valid one
      if (Types.ObjectId.isValid(id)) {
        const result = await UserModel.deleteOne({ _id: new Types.ObjectId(id) });
        if (result.deletedCount > 0) {
          return true;
        }
      }
      
      // If not deleted by ObjectId or not a valid ObjectId, try other fields
      // First check if there's a user with a custom id field matching the provided id
      const resultById = await UserModel.deleteOne({ id: id });
      if (resultById.deletedCount > 0) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error in deleteUser service:", error);
      throw error;
    }
  }

  /**
   * Change user role
   */
  public async changeUserRole(id: string, role: UserRole): Promise<IUser | null> {
    try {
      // Try to update by MongoDB ObjectId if it's valid
      if (Types.ObjectId.isValid(id)) {
        const user = await UserModel.findByIdAndUpdate(
          id,
          { $set: { role } },
          { new: true }
        );
        
        if (user) {
          return user;
        }
      }
      
      // If not updated by ObjectId or not a valid ObjectId, try by custom id field
      return await UserModel.findOneAndUpdate(
        { id: id },
        { $set: { role } },
        { new: true }
      );
    } catch (error) {
      console.error("Error in changeUserRole service:", error);
      throw error;
    }
  }

  /**
   * Verify a password against a hashed version
   */
  public async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Migrate existing plain text passwords to hashed passwords
   * This should be run once to upgrade existing accounts
   */
  public async migratePasswords(): Promise<{ success: number, failed: number }> {
    const users = await UserModel.find({});
    let success = 0;
    let failed = 0;

    for (const user of users) {
      try {
        // Check if the password is already hashed (bcrypt hashes start with $2b$)
        if (!user.password.startsWith('$2b$')) {
          // Hash the plain text password
          const hashedPassword = await this.hashPassword(user.password);
          
          // Update the user with the hashed password
          await UserModel.updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword } }
          );
          success++;
        }
      } catch (error) {
        console.error(`Failed to migrate password for user ${user.email}:`, error);
        failed++;
      }
    }

    return { success, failed };
  }
}
