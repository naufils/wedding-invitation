import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Sign in with Google
        </button>
      </form>
    </main>
  );
}
