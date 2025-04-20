import { createContext, useContext, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { User } from '../types'

interface SupabaseContextType {
  createPost: (title: string, content: string) => Promise<void>
  getPosts: () => Promise<any[]>
  updateUserStreamearStatus: (userId: string, isStreamear: boolean) => Promise<void>
  getUserPosts: (userId: string) => Promise<any[]>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const createPost = async (title: string, content: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user logged in')

    const { error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          content,
          user_id: user.id
        }
      ])

    if (error) throw error
  }

  const getPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  const updateUserStreamearStatus = async (userId: string, isStreamear: boolean) => {
    const { error } = await supabase
      .from('users')
      .update({ is_streamear: isStreamear })
      .eq('id', userId)

    if (error) throw error
  }

  const getUserPosts = async (userId: string) => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  const value = {
    createPost,
    getPosts,
    updateUserStreamearStatus,
    getUserPosts
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
} 