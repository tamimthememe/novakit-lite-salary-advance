import { useState } from "react";
import {
  AppBar, Card, ListRow, Button, AmountText, Toast,
} from "./novakit";

/**
 * Starter app — a minimal NovaPay home screen rendered in a mobile frame.
 */
export default function App() {
  const [toast, setToast] = useState(false);

  function handleSeeOffer() {
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  }

  return (
    <div className="min-h-screen w-full flex justify-center py-6">
      <div className="relative w-[390px] min-h-[780px] bg-white rounded-[28px] shadow-xl overflow-hidden border border-neutral-300">
        <AppBar title="NovaPay" />
        <main className="p-4 space-y-4">
          <Card>
            <div className="text-caption text-neutral-500">Available balance</div>
            <div className="mt-1">
              <AmountText amount={4250} size="display" />
            </div>
          </Card>
          <Card className="space-y-3">
            <div>
              <div className="text-title text-neutral-900">Need cash before payday?</div>
              <div className="text-body text-neutral-700 mt-1">
                You may qualify for a NovaPay salary advance.
              </div>
            </div>
            <Button size="lg" onClick={handleSeeOffer}>
              See your offer
            </Button>
          </Card>
          <Card>
            <div className="text-caption text-neutral-500 mb-1">Recent activity</div>
            <ListRow icon="↑" title="Sent to Ahmed K." subtitle="Today, 2:14 PM" trailing={<AmountText amount={1500} size="body" />} />
            <ListRow icon="↓" title="Salary credited" subtitle="28 Jun" trailing={<AmountText amount={68000} size="body" />} />
            <ListRow icon="↑" title="Mobile top-up" subtitle="27 Jun" trailing={<AmountText amount={500} size="body" />} />
          </Card>
        </main>
        <Toast open={toast} message="TODO: build the salary-advance flow" />
      </div>
    </div>
  );
}
