import { create } from 'zustand';
import type { User } from '../api/types';
type AuthState={token:string|null;user:User|null;setSession:(token:string,user?:User|null)=>void;logout:()=>void};
const TOKEN_KEY='documind_access_token';
export const useAuthStore=create<AuthState>((set)=>({token:localStorage.getItem(TOKEN_KEY),user:null,setSession:(token,user=null)=>{localStorage.setItem(TOKEN_KEY,token);set({token,user});},logout:()=>{localStorage.removeItem(TOKEN_KEY);set({token:null,user:null});}}));
