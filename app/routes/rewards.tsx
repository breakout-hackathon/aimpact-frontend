import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import Navbar from "~/components/dashboard/navbar";
import Footer from "~/components/footer/Footer.client";
import ReferralsTab from "~/components/rewards/referralsTab";
import SharingTab from "~/components/rewards/sharingTab";
import { useRewardsApi, type WithdrawRewardsResponse } from "~/lib/api-hooks/useRewardsApi";
import { userInfo } from "~/lib/hooks/useAuth";

const TABS = {
    Referral: "Referral",
    Sharing: "Sharing",
};

export default function Rewards() {
    const { getReferralsCount, getRewardsWithdrawalReceipts } = useRewardsApi();

    const [tab, setTab] = useState(TABS.Referral);
    const [referralsCount, setReferralsCount] = useState(0);
    const [rewardsWithdrawalReceipts, setRewardsWithdrawalReceipts] = useState<WithdrawRewardsResponse[]>([]);

    const userInfoData = useStore(userInfo);

    useEffect(() => {
        const fetchData = async () => {
          const referralsCount = await getReferralsCount();
          const rewardsWithdrawalReceipts = await getRewardsWithdrawalReceipts();
    
          setReferralsCount(referralsCount.referralsCount);
          setRewardsWithdrawalReceipts([...rewardsWithdrawalReceipts]);
        };
    
        fetchData();
    }, []);

  if (!userInfoData) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      <Navbar />
      <section id="rewards" className="py-16 md:py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-2">Rewards</h1>
          <p className="text-sm text-gray-400 mb-8 font-normal">Invite friends to receive rewards in Aimpact way.</p>
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            {/* Tabs inside the block */}
            <div className="flex space-x-2 mb-8">
              {Object.values(TABS).map((t) => (
                <button
                  key={t}
                  className={`flex-1 py-2 rounded-t-lg font-semibold text-center transition-colors duration-150 ${
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
            {tab === TABS.Sharing && (
                <SharingTab
                    transactions={rewardsWithdrawalReceipts}
                    availableRewards={userInfoData.referralsRewards}
                    totalEarnedRewards={userInfoData.referralsRewards}
                />
            )}
            {tab === TABS.Referral && (
              <ReferralsTab
                referralsCount={referralsCount}
                refCode={userInfoData.inviteCode || ""}
              />
            )}
          </div>
        </div>
      </section>
      <Footer positionClass="fixed bottom-0 left-0 w-full" />
    </main>
  );
}
