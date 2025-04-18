import Header from "@/components/Header";
import OrderForm from "@/components/Order";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-black p-5 mt-14">
        <OrderForm />
      </div>
    </div>
  );
}
