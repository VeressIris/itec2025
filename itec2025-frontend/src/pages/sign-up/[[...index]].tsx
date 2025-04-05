import Navbar from "@/components/navbar";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div>
      <Navbar />

      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SignUp
          path="/sign-up"
          routing="path"
          fallbackRedirectUrl="/post-signup"
        />
      </div>
    </div>
  );
}
