/**
 * Password Migration Script
 * 
 * This script migrates all existing plain text passwords in the database to bcrypt hashed passwords.
 * Run this script once after deploying the password encryption changes.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import UserService from '../services/user';
import dbconnect from '../utils/dbconnect';

// Load environment variables
dotenv.config();

async function migratePasswords() {
  console.log('Starting password migration...');
  
  try {
    // Connect to the database
    await dbconnect();
    console.log('Connected to database');
    
    // Create user service instance
    const userService = new UserService();
    
    // Migrate passwords
    console.log('Migrating passwords...');
    const result = await userService.migratePasswords();
    
    console.log(`Password migration completed:
      - Successfully migrated: ${result.success} passwords
      - Failed migrations: ${result.failed} passwords`);
    
    if (result.failed > 0) {
      console.warn('Warning: Some passwords could not be migrated. These users may need to reset their passwords.');
    }
  } catch (error) {
    console.error('Error during password migration:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
  
  process.exit(0);
}

// Execute the migration
migratePasswords();