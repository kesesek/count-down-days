import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

export function useAuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await fetchAuthSession();
        setIsLoggedIn(!!session.tokens?.idToken);
      } catch {
        setIsLoggedIn(false);
      }
    }

    checkSession();
  }, []);

  return isLoggedIn;
}