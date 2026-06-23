const CLERK_API = "https://api.clerk.com/v1";

function clerkSecret(): string {
  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) {
    throw new Error(
      "CLERK_SECRET_KEY não definida — configure no ambiente antes de rodar os testes E2E.",
    );
  }
  return secret;
}

let cachedUserId: string | null = null;

async function ensureTestUser(): Promise<string> {
  if (cachedUserId) return cachedUserId;

  const createRes = await fetch(`${CLERK_API}/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkSecret()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: ["testcheckout@delivery.com"],
      password: "aK9mXp4Lq7vR2nWx",
      public_metadata: { role: "CUSTOMER" },
    }),
  });

  if (createRes.ok) {
    const user = await createRes.json();
    cachedUserId = user.id;
    return user.id;
  }

  const searchRes = await fetch(
    `${CLERK_API}/users?email_address=testcheckout@delivery.com&limit=1`,
    { headers: { Authorization: `Bearer ${clerkSecret()}` } }
  );
  if (!searchRes.ok) {
    throw new Error(`Failed to search Clerk user: ${await searchRes.text()}`);
  }

  const data = await searchRes.json();
  const user = data.value?.[0] || data.data?.[0] || data?.[0];
  if (user) {
    cachedUserId = user.id;
    return user.id;
  }

  throw new Error("Could not find or create Clerk test user");
}

export async function getClerkToken(): Promise<string> {
  const userId = await ensureTestUser();

  const sessionRes = await fetch(`${CLERK_API}/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkSecret()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!sessionRes.ok) {
    throw new Error(`Failed to create session: ${await sessionRes.text()}`);
  }

  const session = await sessionRes.json();

  const tokenRes = await fetch(
    `${CLERK_API}/sessions/${session.id}/tokens`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clerkSecret()}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    }
  );

  if (!tokenRes.ok) {
    throw new Error(`Failed to get token: ${await tokenRes.text()}`);
  }

  const token = await tokenRes.json();
  return token.jwt;
}
