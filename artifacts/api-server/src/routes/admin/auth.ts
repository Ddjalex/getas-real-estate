import { Router } from "express";
import { db, adminUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }

  try {
    const [user] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.username, username));

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    req.session.adminId = user.id;
    req.session.adminUsername = user.username;
    res.json({ ok: true, username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// Change email (username) and/or password — requires current password to confirm identity
router.put("/credentials", async (req, res) => {
  if (!req.session?.adminId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { currentPassword, newUsername, newPassword } = req.body as {
    currentPassword?: string;
    newUsername?: string;
    newPassword?: string;
  };

  if (!currentPassword) {
    res.status(400).json({ error: "Current password is required" });
    return;
  }
  if (!newUsername && !newPassword) {
    res.status(400).json({ error: "Provide a new username or new password" });
    return;
  }

  try {
    const [user] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.id, req.session.adminId));

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const updates: Partial<typeof adminUsersTable.$inferInsert> = {};
    if (newUsername && newUsername !== user.username) {
      updates.username = newUsername;
    }
    if (newPassword) {
      updates.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    if (Object.keys(updates).length > 0) {
      await db.update(adminUsersTable).set(updates).where(eq(adminUsersTable.id, user.id));
      if (updates.username) {
        req.session.adminUsername = updates.username;
      }
    }

    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to update credentials" });
  }
});

router.get("/me", (req, res) => {
  if (!req.session?.adminId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({ id: req.session.adminId, username: req.session.adminUsername });
});

export default router;
