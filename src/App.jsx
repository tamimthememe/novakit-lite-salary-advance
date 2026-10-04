import { useState } from "react";
import { AppBar, Card, ListRow, Button, AmountText } from "./novakit";
import TermsOffer from "./TermsOffer.jsx";

export default function App() {
  const [screen, setScreen] = useState("home");
  return (
    <div className="min-h-screen w-full flex justify-center py-6">
      <div className="relative w-[390px] h-[844px] bg-white rounded-[28px] shadow-xl overflow-hidden border border-neutral-300">
        {screen === "offer" ? (
          <TermsOffer onBack={() => setScreen("home")} onContinue={() => setScreen("home")} />
        ) : (
          <>
            <AppBar title="NovaPay" />
            <main className="p-4 space-y-4">
              <Card>
                <div className="text-caption text-neutral-500">Available balance</div>
                <div className="mt-1"><AmountText amount={4250} size="display" /></div>
              </Card>
              <Card className="space-y-3">
                <div>
                  <div className="text-title text-neutral-900">You&apos;re approved for an advance</div>
                  <div className="text-body text-neutral-700 mt-1">An advance against your salary, repaid on payday.</div>
                </div>
                <Button size="lg" onClick={() => setScreen("offer")}>See your offer</Button>
              </Card>
              <Card>
                <div className="text-caption text-neutral-500 mb-1">Recent activity</div>
                <ListRow icon="↑" title="Sent to Ahmed K." subtitle="3 Oct" trailing={<AmountText amount={1500} size="body" />} />
                <ListRow icon="↓" title="Salary credited" subtitle="28 Sep" trailing={<AmountText amount={68000} size="body" />} />
                <ListRow icon="↑" title="Mobile top-up" subtitle="25 Sep" trailing={<AmountText amount={500} size="body" />} />
              </Card>
            </main>
          </>
        )}
      </div>
    </div>
  );
}
