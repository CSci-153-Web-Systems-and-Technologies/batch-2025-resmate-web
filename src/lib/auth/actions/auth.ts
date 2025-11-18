'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { createUser, getUserById } from '@/lib/db/user-db'
import { User } from '@/lib/model/user'


export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  
  if(error || !user) {
    console.error('Error fetching current user:', error)
    return null
  }

  const userData = await getUserById(user.id);

  return userData ? userData : null;
}


export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  if(!data.email || !data.password) {
    return { error: 'Email and password are required.' }
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error)

    if(error.message.includes('Invalid login credentials')) {
      return new Error('Invalid email or password. Please try again.');
    }

    if(error.message.includes('Email not confirmed')) {
      return new Error('Email not confirmed. Please check your inbox for a confirmation email.');
    }

    if(error.message.includes('User not found')) {
      return new Error('User not found. Please check your email or sign up for a new account.');
    }

    return { error: error.message || 'Failed to login. Please try again.'}
  }

  const { data: userData } = await supabase.auth.getUser();

  if(userData.user) {
    const existingUser = await getUserById(userData.user.id); 
    if(!existingUser) {
      const newUser: User = {
        userId: userData.user.id,
        email: userData.user.email || '',
        firstName: '',
        lastName: '',
        role: '',
        department: ''
      };

      await createUser(newUser);
      // You might want to add code here to save the newUser to your database
    }
    
    if(!existingUser || !existingUser.firstName || !existingUser.lastName) {
      redirect('/setup')
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}


export async function completeUserProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  const firstName = formData.get('firstname') as string
  const lastName = formData.get('lastname') as string
  const role = formData.get('role') as string
  const department = formData.get('department') as string

  if (!firstName || !lastName || !role || !department || firstName.trim() === '' || lastName.trim() === '' || role.trim() === '' || department.trim() === '') {
    return { error: 'First name and last name are required' }
  }

  if(authError || !user) {
    return { error: 'User not authenticated' }
  }

  try {
    const existingUser = await getUserById(user.id)

    if (!existingUser) {
      // Insert new user if doesn't exist
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          user_id: user.id,
          email: user.email,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          role: role,
          department: department.trim(),
        })

      if (insertError) {
        console.error('Error inserting user:', insertError)
        return { error: 'Failed to create user profile' }
      }
    } else {
      // Update existing user
      const { error: updateError } = await supabase
        .from('users')
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          role: role,
          department: department.trim(),
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Error updating user:', updateError)
        return { error: 'Failed to update user profile' }
      }
    }

    // Update auth user metadata as well
    await supabase.auth.updateUser({
      data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        role: role,
        department: department.trim(),
      }
    })

    // Revalidate all paths to clear cache
    revalidatePath('/', 'layout')
    
    // Small delay to ensure database update completes
    await new Promise(resolve => setTimeout(resolve, 500))
    
  } catch(error) {
    console.error('Error completing profile:', error)
    return { error: 'An unexpected error occurred' }
  }

  redirect('/')
}


export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}