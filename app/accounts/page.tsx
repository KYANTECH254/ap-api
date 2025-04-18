import AccountInfo from "@/components/Accounts";
import Header from "@/components/Header";

export default function Page() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-black p-5 mt-14">
        <AccountInfo />
      </div>
    </div>
  );
}
