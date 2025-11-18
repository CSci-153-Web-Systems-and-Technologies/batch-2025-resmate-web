'use server'
import { createClient } from "../../utils/supabase/server"
import { User } from "../model/user"

export async function getUserById(userId: string): Promise<User | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single()

  if(error) {
    console.error('Error fetching user:', error)
    return null
  }

  if (!data) {
    console.log('No user data found for:', userId)
    return null
  }

  const user: User = {
    userId: data.user_id,
    email: data.email || '',
    firstName: data.first_name || '',
    lastName: data.last_name || '',
    role: data.role || 'student',
    department: data.department || '',
  }

  console.log('getUserById result:', user) // Debug log
  return user
}


export async function createUser(user: User): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('users')
    .insert({
      user_id: user.userId,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      role: user.role,
      department: user.department
    });

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}


export async function updateUser(userId: string, updates: Partial<User>) {
  const supabase = await createClient();

  const dbUpdates: any = {}
  if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName
  if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName
  if (updates.email !== undefined) dbUpdates.email = updates.email
  if (updates.role !== undefined) dbUpdates.role = updates.role
  if (updates.department !== undefined) dbUpdates.department = updates.department

  const { error } = await supabase
    .from('users')
    .update(dbUpdates)
    .eq('user_id', userId)

  if (error) {
    console.error('Error updating user:', error)
    return { error: error.message }
  }

  return { success: true }
}


