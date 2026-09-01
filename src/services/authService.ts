import bcrypt from 'bcryptjs';
import { eq, or } from 'drizzle-orm';
import { OAuth2Client } from 'google-auth-library';
import db from '../db';
import { users, User } from '../db/schema/users';
import env from '../config/env';

const googleClient = new OAuth2Client(env.googleClientId);

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function loginWithCredentials(
  identifier: string,
  passwordAttempt: string
): Promise<User> {
  const cleanIdentifier = identifier.trim().toLowerCase();

  // Find user by email or name (e.g. "bambique" or "bambique@bambique.com")
  const foundUsers = await db
    .select()
    .from(users)
    .where(
      or(
        eq(users.email, cleanIdentifier),
        eq(users.name, identifier.trim()),
        eq(users.email, `${cleanIdentifier}@bambique.com`)
      )
    )
    .limit(1);

  if (foundUsers.length === 0) {
    throw new Error('Credenciales inválidas');
  }

  const user = foundUsers[0];

  if (!user.password) {
    throw new Error('Esta cuenta se registró con Google. Por favor inicia sesión con Google.');
  }

  const isValidPassword = await comparePassword(passwordAttempt, user.password);
  if (!isValidPassword) {
    throw new Error('Credenciales inválidas');
  }

  return user;
}

export async function registerUser(data: {
  name: string;
  lastName?: string;
  email: string;
  password: string;
  gender?: 'male' | 'female' | 'other';
  nitCi?: string;
}): Promise<User> {
  const cleanEmail = data.email.trim().toLowerCase();

  const existingUsers = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);

  if (existingUsers.length > 0) {
    throw new Error('El correo electrónico ya se encuentra registrado');
  }

  const hashedPassword = await hashPassword(data.password);

  const [newUser] = await db
    .insert(users)
    .values({
      name: data.name.trim(),
      lastName: data.lastName?.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: 'user',
      gender: data.gender,
      nitCi: data.nitCi?.trim(),
    })
    .returning();

  return newUser;
}

export async function loginWithGoogle(idToken: string): Promise<User> {
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.googleClientId,
    });
    payload = ticket.getPayload();
  } catch (error) {
    throw new Error(`Token de Google inválido o expirado: ${(error as Error).message}`);
  }

  if (!payload || !payload.email) {
    throw new Error('No se pudo obtener la información del perfil de Google');
  }

  const googleId = payload.sub;
  const email = payload.email.toLowerCase();
  const name = payload.name || payload.given_name || 'Usuario Google';
  const lastName = payload.family_name;
  const avatarUrl = payload.picture;

  // Check if user exists by googleId or email
  const existingUsers = await db
    .select()
    .from(users)
    .where(or(eq(users.googleId, googleId), eq(users.email, email)))
    .limit(1);

  if (existingUsers.length > 0) {
    const existing = existingUsers[0];
    // Update googleId or avatarUrl if not set
    if (!existing.googleId || !existing.avatarUrl) {
      const [updatedUser] = await db
        .update(users)
        .set({
          googleId: existing.googleId || googleId,
          avatarUrl: existing.avatarUrl || avatarUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id))
        .returning();
      return updatedUser;
    }
    return existing;
  }

  // Create new user via Google
  const [newUser] = await db
    .insert(users)
    .values({
      name,
      lastName,
      email,
      googleId,
      avatarUrl,
      role: 'user',
    })
    .returning();

  return newUser;
}

export async function getUserById(id: string): Promise<User | null> {
  const foundUsers = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return foundUsers.length > 0 ? foundUsers[0] : null;
}
