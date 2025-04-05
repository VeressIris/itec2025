import { useRouter } from "next/router";

export default function Event() {
  const router = useRouter();

  return (
    <div
      style={{
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div></div>
    </div>
  );
}
