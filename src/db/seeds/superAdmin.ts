import { eq, or } from 'drizzle-orm';
import db from '../index';
import { users } from '../schema/users';
import { hashPassword } from '../../services/authService';

export async function seedSuperAdmin() {
  const superAdminEmail = 'bambique@bambique.com';
  const superAdminName = 'bambique';
  const superAdminPassword = 'bambique';

  try {
    const existing = await db
      .select()
      .from(users)
      .where(or(eq(users.email, superAdminEmail), eq(users.name, superAdminName)))
      .limit(1);

    if (existing.length === 0) {
      const hashedPassword = await hashPassword(superAdminPassword);
      await db.insert(users).values({
        name: superAdminName,
        email: superAdminEmail,
        password: hashedPassword,
        role: 'super_admin',
      });
      console.log(
        '✅ SuperAdmin inicial creado: usuario="bambique" (bambique@bambique.com), password="bambique", rol="super_admin"'
      );
    } else {
      // Ensure super_admin role
      if (existing[0].role !== 'super_admin') {
        await db.update(users).set({ role: 'super_admin' }).where(eq(users.id, existing[0].id));
      }
    }
  } catch (error) {
    console.error('⚠️ Error al verificar/crear superAdmin:', error);
  }
}
