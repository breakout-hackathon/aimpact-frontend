import { useState } from "react";
import { Clipboard, Check } from "@phosphor-icons/react";

interface ReferralsTabProps {
    referralsCount: number;
    refCode: string;
}

export default function ReferralsTab({ referralsCount, refCode }: ReferralsTabProps) {
    const [copied, setCopied] = useState(false);

    const refLink = `${window.location.origin}?refCode=${refCode}`;

    const handleCopy = () => {
        if (refCode) {
            navigator.clipboard.writeText(refLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    return (
        <div className="space-y-6">
            {/* Referral Link Section */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">My referral link</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-l font-mono bg-gray-700 px-4 py-2 rounded-lg">{refCode ? refLink : "—"}</span>
                    <button
                        onClick={handleCopy}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                        title="Copy"
                    >
                        {copied ? <Check size={20} className="text-green-400" /> : <Clipboard size={20} className="text-white" />}
                    </button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Referral stats</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">My referrals</p>
                        <p className="text-2xl font-bold text-white">{referralsCount}</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Sharing percent</p>
                        <p className="text-2xl font-bold text-white">{import.meta.env.VITE_REWARDS_SHARING_PERCENT}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}