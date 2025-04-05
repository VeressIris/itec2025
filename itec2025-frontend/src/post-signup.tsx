import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { backendUrl } from "./utils";

export default function PostSignup() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const saveUserToDb = async () => {
        const res = await fetch(`${backendUrl}/addUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          // Redirect or show success
          router.push("/dashboard");
        } else {
          console.error("Failed to save user to DB");
        }
      };

      saveUserToDb();
    }
  }, [isLoaded, user, router]);

  return <p>Finishing signup...</p>;
}
