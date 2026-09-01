import '@fastify/jwt';
import { GoogleAuth } from 'google-auth-library';
import { sheets_v4 } from 'googleapis';
import { FastifyReply, FastifyRequest } from 'fastify';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string;
      email: string;
      role: 'super_admin' | 'admin' | 'organizer' | 'user';
      name: string;
    };
    user: {
      id: string;
      email: string;
      role: 'super_admin' | 'admin' | 'organizer' | 'user';
      name: string;
    };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    googleAuth: GoogleAuth;
    googleSheetsService: sheets_v4.Sheets;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
