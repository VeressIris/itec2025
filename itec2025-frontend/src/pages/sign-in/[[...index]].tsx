import Navbar from "@/components/navbar";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
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
        <SignIn
          path="/sign-in"
          routing="path"
          fallbackRedirectUrl="/post-signup"
        />
      </div>
    </div>
  );
};

export default SignInPage;
