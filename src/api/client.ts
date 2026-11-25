import axios from 'axios';
import type { ChunkList, Delivery, DeliveryList, Doc, DocumentContent, DocumentList, QueryResponse, TenantUsage, Token, User, Webhook, WebhookCreated } from './types';
import { useAuthStore } from '../store/auth';
export const api = axios.create({ baseURL: (import.meta.env.VITE_API_URL || '').replace(/\/$/, ''), timeout: 45_000 });
api.interceptors.request.use(config => { const token = useAuthStore.getState().token; if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
api.interceptors.response.use(r => r, error => { if (error.response?.status === 401 && useAuthStore.getState().token) useAuthStore.getState().logout(); return Promise.reject(error); });
const data = <T,>(p:Promise<{data:T}>) => p.then(r=>r.data);
export const authApi = {
  login: (email:string,password:string) => { const body = new URLSearchParams({username:email,password}); return data<Token>(api.post('/v1/auth/login',body,{headers:{'Content-Type':'application/x-www-form-urlencoded'}})); },
  signup: (tenant_name:string,email:string,password:string) => data<{user:User;token:Token}>(api.post('/v1/auth/signup',{tenant_name,email,password})),
};
export const documentsApi = {
  list: (limit=100,offset=0) => data<DocumentList>(api.get('/v1/documents',{params:{limit,offset}})),
  get: (id:string) => data<Doc>(api.get(`/v1/documents/${id}`)),
  upload: (file:File) => { const body=new FormData(); body.append('file',file); return data<Doc>(api.post('/v1/documents',body,{headers:{'Idempotency-Key':crypto.randomUUID()}})); },
  retry: (id:string) => data<Doc>(api.post(`/v1/documents/${id}/retry`)),
  remove: (id:string) => api.delete(`/v1/documents/${id}`),
  content: (id:string) => data<DocumentContent>(api.get(`/v1/documents/${id}/content`)),
  chunks: (id:string,limit=100,offset=0) => data<ChunkList>(api.get(`/v1/documents/${id}/chunks`,{params:{limit,offset}})),
};
export const tenantApi = { usage:()=>data<TenantUsage>(api.get('/v1/tenant')) };
export const queryApi = { ask:(question:string,document_ids?:string[],top_k=5)=>data<QueryResponse>(api.post('/v1/query',{question,document_ids:document_ids?.length?document_ids:null,top_k})) };
export const webhooksApi = {
  list:()=>data<Webhook[]>(api.get('/v1/webhooks')),
  create:(url:string,events:string[])=>data<WebhookCreated>(api.post('/v1/webhooks',{url,events})),
  remove:(id:string)=>api.delete(`/v1/webhooks/${id}`),
  ping:(id:string)=>data<Delivery>(api.post(`/v1/webhooks/${id}/ping`)),
  deliveries:(id:string,limit=20,offset=0)=>data<DeliveryList>(api.get(`/v1/webhooks/${id}/deliveries`,{params:{limit,offset}})),
};
export function apiError(error:unknown):string { if (axios.isAxiosError(error)) { const detail=error.response?.data?.detail; return typeof detail==='string'?detail:error.message || 'The request failed.'; } return 'Something went wrong. Please try again.'; }
