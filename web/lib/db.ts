import { sql } from "@vercel/postgres";

export { sql };

export async function initializeDatabase() {
  // Original tables — keep IF NOT EXISTS for idempotency
  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      description TEXT NOT NULL,
      option_a    TEXT NOT NULL DEFAULT '',
      option_b    TEXT NOT NULL DEFAULT '',
      option_a_label TEXT DEFAULT 'Option A',
      option_b_label TEXT DEFAULT 'Option B',
      bounty_per_vote DECIMAL(10,4) NOT NULL DEFAULT 0.08,
      max_workers  INTEGER DEFAULT 20,
      requester_wallet TEXT NOT NULL,
      x402_tx_hash TEXT,
      status      TEXT DEFAULT 'open',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS workers (
      nullifier_hash  TEXT PRIMARY KEY,
      wallet_address  TEXT,
      verified_at     TIMESTAMPTZ DEFAULT NOW(),
      total_earned    DECIMAL(10,4) DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS votes (
      id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      task_id       TEXT REFERENCES tasks(id) ON DELETE CASCADE,
      nullifier_hash TEXT REFERENCES workers(nullifier_hash),
      choice        TEXT NOT NULL CHECK (choice IN ('A', 'B')),
      payment_tx_hash TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(task_id, nullifier_hash)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS payments (
      id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      type          TEXT NOT NULL,
      wallet_address TEXT,
      amount_usdc   DECIMAL(10,6),
      tx_hash       TEXT,
      task_id       TEXT REFERENCES tasks(id),
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // V2: N-option support
  await sql`
    CREATE TABLE IF NOT EXISTS task_options (
      id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      task_id      TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      option_index INTEGER NOT NULL,
      label        TEXT NOT NULL DEFAULT 'Option',
      content      TEXT NOT NULL,
      UNIQUE(task_id, option_index)
    )
  `;

  // V2: Voter reputation tracking
  await sql`
    CREATE TABLE IF NOT EXISTS reputation (
      nullifier_hash TEXT PRIMARY KEY REFERENCES workers(nullifier_hash),
      score          DECIMAL(4,2) DEFAULT 0,
      total_votes    INTEGER DEFAULT 0,
      total_detailed INTEGER DEFAULT 0,
      avg_rating     DECIMAL(4,2) DEFAULT 0,
      badge          TEXT DEFAULT 'new'
    )
  `;

  // V2: Alter existing tables to add new columns (idempotent)
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS context TEXT`;
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'quick'`;
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS creator_rating_up INTEGER DEFAULT 0`;
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS creator_rating_down INTEGER DEFAULT 0`;

  await sql`ALTER TABLE votes ADD COLUMN IF NOT EXISTS option_index INTEGER`;
  await sql`ALTER TABLE votes ADD COLUMN IF NOT EXISTS feedback_text TEXT`;
  await sql`ALTER TABLE votes ADD COLUMN IF NOT EXISTS feedback_rating INTEGER`;
  await sql`ALTER TABLE votes ADD COLUMN IF NOT EXISTS creator_rating INTEGER`;

  // V2: Seed task_options from existing option_a/option_b (backward compat, runs once per task)
  await sql`
    INSERT INTO task_options (task_id, option_index, label, content)
    SELECT t.id, 0, COALESCE(t.option_a_label, 'Option A'), t.option_a
    FROM tasks t
    WHERE t.option_a != ''
      AND NOT EXISTS (
        SELECT 1 FROM task_options WHERE task_id = t.id AND option_index = 0
      )
  `;

  await sql`
    INSERT INTO task_options (task_id, option_index, label, content)
    SELECT t.id, 1, COALESCE(t.option_b_label, 'Option B'), t.option_b
    FROM tasks t
    WHERE t.option_b != ''
      AND NOT EXISTS (
        SELECT 1 FROM task_options WHERE task_id = t.id AND option_index = 1
      )
  `;
}
