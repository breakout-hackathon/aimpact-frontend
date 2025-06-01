import { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../ui/Button';
import { classNames } from '~/utils/classNames';
import { type WithdrawRewardsResponse } from '~/lib/api-hooks/useRewardsApi';

interface SharingTabProps {
    availableRewards: number;
    totalEarnedRewards: number;
    transactions: WithdrawRewardsResponse[];
}

export default function SharingTab({ transactions, availableRewards, totalEarnedRewards }: SharingTabProps) {
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const handleWithdraw = async () => {
        setIsWithdrawing(true);
        try {
            toast.success('Withdrawal successful!');
        } catch (error) {
            toast.error('Withdrawal failed. Please try again.');
            console.error('Withdrawal error:', error);
        } finally {
            setIsWithdrawing(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Rewards Summary */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Your Rewards</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Available Rewards</p>
                        <p className="text-2xl font-bold text-white">{availableRewards || 0} SOL</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Total Earned</p>
                        <p className="text-2xl font-bold text-white">{totalEarnedRewards || 0} SOL</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button
                    onClick={handleWithdraw}
                    disabled={isWithdrawing}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                    {isWithdrawing ? 'Withdrawing...' : 'Withdraw Rewards'}
                </Button>
                <Button
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                    Buy Messages
                </Button>
            </div>

            {/* Transaction History */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Withdrawal History</h2>
                <div className="space-y-4">
                    {transactions.length ? transactions.map((tx) => (
                        <a
                            key={tx.id}
                            href={`https://solscan.io/tx/${tx.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                            title="View on Solscan"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500/20">
                                    <div className="w-4 h-4 i-ph:arrow-up-right" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Withdrawal</p>
                                    <p className="text-sm text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-purple-400">-{tx.amount} SOL</p>
                            </div>
                        </a>
                    )) : (
                        <div className="text-gray-400 text-sm">There is no withdrawal yet</div>
                    )}
                </div>
            </div>
        </div>
    );
}