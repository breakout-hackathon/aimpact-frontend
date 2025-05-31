import { useState } from "react";
import Navbar from "~/components/dashboard/navbar";
import Footer from "~/components/footer/Footer.client";
import { useRefCode } from "~/lib/hooks/useRefCode";
import { Clipboard, Check } from "@phosphor-icons/react";
import { useAuth } from "~/lib/hooks/useAuth";

const TABS = ["Staking", "F Point", "Referral"];

export default function Rewards() {
  const [tab, setTab] = useState("Referral");
  const [copied, setCopied] = useState(false);

  const { refCode } = useRefCode();

  // These would come from your backend/user context
  const referralsCount = 5;
  const discountPercent = 10;
  const referralRewards = 2.5; // in SOL or points
  const lastWithdrawalTx = "5hG...abc";
  const [buyAmount, setBuyAmount] = useState(10);

  const handleCopy = () => {
    if (refCode) {
      navigator.clipboard.writeText(refCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      <Navbar />
      <section id="rewards" className="py-16 md:py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8">Rewards</h1>
          {/* Tabs */}
          <div className="flex space-x-2 mb-8">
            {TABS.map((t) => (
              <button
                key={t}
                className={`px-6 py-2 rounded-t-lg font-semibold ${
                  tab === t
                    ? "bg-gray-800 text-white"
                    : "bg-gray-700 text-gray-400 hover:text-white"
                }`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          {tab === "Referral" && (
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">My Referral Code</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-mono bg-gray-800 px-4 py-2 rounded">{refCode || "—"}</span>
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-gray-700 rounded hover:bg-gray-600"
                    title="Copy"
                  >
                    {copied ? <Check size={20} /> : <Clipboard size={20} />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-800 rounded p-4">
                  <div className="text-gray-400">My Referrals</div>
                  <div className="text-2xl font-bold text-white">{referralsCount}</div>
                </div>
                <div className="bg-gray-800 rounded p-4">
                  <div className="text-gray-400">Discount Percent</div>
                  <div className="text-2xl font-bold text-white">{discountPercent}%</div>
                </div>
                <div className="bg-gray-800 rounded p-4">
                  <div className="text-gray-400">Referral Rewards</div>
                  <div className="text-2xl font-bold text-white">{referralRewards} SOL</div>
                </div>
                <div className="bg-gray-800 rounded p-4">
                  <div className="text-gray-400">Last Withdrawal Tx</div>
                  <div className="text-lg font-mono text-blue-400">{lastWithdrawalTx}</div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 bg-gray-800 rounded p-4 flex flex-col items-center">
                  <div className="mb-2 text-gray-400">Buy Messages with Rewards</div>
                  <input
                    type="number"
                    min={1}
                    value={buyAmount}
                    onChange={e => setBuyAmount(Number(e.target.value))}
                    className="w-24 text-center rounded bg-gray-900 text-white border border-gray-700 mb-2"
                  />
                  <button className="px-4 py-2 bg-blue-600 rounded text-white font-semibold hover:bg-blue-700">
                    Buy {buyAmount} Messages
                  </button>
                </div>
                <div className="flex-1 bg-gray-800 rounded p-4 flex flex-col items-center">
                  <div className="mb-2 text-gray-400">Withdraw Rewards</div>
                  <button className="px-4 py-2 bg-green-600 rounded text-white font-semibold hover:bg-green-700">
                    Withdraw to SOL
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* You can add content for Staking and F Point tabs here */}
          {tab === "Staking" && (
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg text-white">
              {/* Staking content goes here */}
              <div>Staking info and actions...</div>
            </div>
          )}
          {tab === "F Point" && (
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg text-white">
              {/* F Point content goes here */}
              <div>F Point info and actions...</div>
            </div>
          )}
        </div>
      </section>
      <Footer positionClass="fixed bottom-0 left-0 w-full" />
    </main>
  );
}
