import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { loginSchema, registerSchema, googleAuthSchema, meSchema } from '../schemas/authSchema';
import {
  loginWithCredentials,
  registerUser,
  loginWithGoogle,
  getUserById,
} from '../services/authService';

const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // POST /auth/login
  fastify.post('/auth/login', { schema: loginSchema }, async (request, reply) => {
    const body = request.body as {
      email?: string;
      identifier?: string;
      password: string;
    };
    const identifier = body.identifier || body.email;

    if (!identifier) {
      return reply.status(400).send({ error: 'Debes ingresar tu correo o nombre de usuario' });
    }

    try {
      const user = await loginWithCredentials(identifier, body.password);
      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return reply.status(200).send({
        token,
        user: {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          gender: user.gender,
          avatarUrl: user.avatarUrl,
        },
      });
    } catch (error) {
      return reply.status(401).send({ error: (error as Error).message });
    }
  });

  // POST /auth/register
  fastify.post('/auth/register', { schema: registerSchema }, async (request, reply) => {
    const body = request.body as {
      name: string;
      lastName?: string;
      email: string;
      password: string;
      gender?: 'male' | 'female' | 'other';
      nitCi?: string;
    };

    try {
      const user = await registerUser(body);
      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return reply.status(201).send({
        token,
        user: {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          gender: user.gender,
          avatarUrl: user.avatarUrl,
        },
      });
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  // POST /auth/google
  fastify.post('/auth/google', { schema: googleAuthSchema }, async (request, reply) => {
    const { idToken } = request.body as { idToken: string };

    try {
      const user = await loginWithGoogle(idToken);
      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return reply.status(200).send({
        token,
        user: {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          gender: user.gender,
          avatarUrl: user.avatarUrl,
        },
      });
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  // GET /auth/me (Protected route)
  fastify.get(
    '/auth/me',
    {
      schema: meSchema,
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const { id } = request.user;
      const user = await getUserById(id);

      if (!user) {
        return reply.status(404).send({ error: 'Usuario no encontrado' });
      }

      return reply.status(200).send({
        user: {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          gender: user.gender,
          avatarUrl: user.avatarUrl,
          nitCi: user.nitCi,
        },
      });
    }
  );
};

export default authRoutes;
