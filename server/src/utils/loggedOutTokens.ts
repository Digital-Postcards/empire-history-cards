// Tokens that were logged out before they expired, so authenticate can reject
// them. Each entry is the token's id (jti) and when it expires anyway.
//
// This lives in memory, so a server restart forgets it. That's acceptable
// because tokens only last an hour.
const loggedOutTokens = new Map<string, number>();

export const markLoggedOut = (tokenId: string, expiresAt: number): void => {
  loggedOutTokens.set(tokenId, expiresAt);

  // Forget tokens that have expired by now, they're rejected anyway
  const now = Math.floor(Date.now() / 1000);
  for (const [id, exp] of loggedOutTokens) {
    if (exp < now) loggedOutTokens.delete(id);
  }
};

export const isLoggedOut = (tokenId?: string): boolean =>
  tokenId !== undefined && loggedOutTokens.has(tokenId);
