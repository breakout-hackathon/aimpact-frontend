'use client';

import type { Project } from '@/types/project';
import { BadgeCustom, type BadgeCustomProps } from '@/components/ui/badge-custom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from 'lucide-react';

const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1000000000) {
    return `$${(marketCap / 1000000000).toFixed(1)}B`;
  } else if (marketCap >= 1000000) {
    return `$${(marketCap / 1000000).toFixed(1)}M`;
  } else if (marketCap >= 1000) {
    return `$${(marketCap / 1000).toFixed(1)}K`;
  } else {
    return `$${marketCap}`;
  }
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const { token, title, description, category, riskLevel, launchDate, website, id: projectId } = project;

  /*
   * const isPriceUp = token.priceChangePercentage24h > 0;
   * const priceChangeColor = isPriceUp ? "text-emerald-500" : "text-rose-500";
   * const priceChangeIcon = isPriceUp ? (
   *   <ArrowUpRight className="w-4 h-4" />
   * ) : (
   *   <ArrowDownRight className="w-4 h-4" />
   * );
   */

  const getCategoryVariant = (category: string): string => {
    return category.toLowerCase() as any;
  };

  /*
   * const getRiskVariant = (risk: string): string => {
   *   switch (risk) {
   *     case "Low":
   *       return "success";
   *     case "Medium":
   *       return "warning";
   *     case "High":
   *       return "negative";
   *     case "Extreme":
   *       return "destructive";
   *     default:
   *       return "secondary";
   *   }
   * };
   */

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative bg-black/65 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 z-0 group-hover:opacity-100 opacity-0 transition-opacity duration-300" />

      {/* onClick={() => window.location.href = `/projects/${index}`} */}
      <a className="block p-6 relative z-10 cursor-pointer" href={`/projects/${index}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {token.icon && (
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <img src={token.icon} alt={token.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-foreground">{title}</h3>
              <div className="flex items-center mt-1">
                {/* <span className="text-2xl font-bold mr-2">{token.symbol}</span> */}
                <BadgeCustom variant={getCategoryVariant(category) as BadgeCustomProps['variant']}>
                  {category}
                </BadgeCustom>
              </div>
            </div>
          </div>

          {/* <div className="text-right">
            <div className="text-sm text-muted-foreground">Current Price</div>
            <div className="font-bold text-lg">
              ${token.currentPrice.toFixed(2)}
            </div>
          </div> */}
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

        {/* <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Market Cap</div>
            <div className="font-semibold">
              {formatMarketCap(token.marketCap)}
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">24h Change</div>
            <div
              className={`font-semibold flex items-center ${priceChangeColor}`}
            >
              {priceChangeIcon}
              {Math.abs(token.priceChangePercentage24h).toFixed(2)}%
            </div>
          </div>
        </div> */}

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {/* <BadgeCustom variant={getRiskVariant(riskLevel)}>
              {riskLevel} Risk
            </BadgeCustom> */}

            {launchDate && (
              <BadgeCustom variant="secondary">{formatDistanceToNow(launchDate, { addSuffix: true })}</BadgeCustom>
            )}
          </div>

          {website && (
            <motion.a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary flex items-center hover:underline"
              whileHover={{ x: 2 }}
              aria-label={`Visit ${title} website`}
            >
              Website
              <ExternalLink className="w-3 h-3 ml-1" />
            </motion.a>
          )}
        </div>
      </a>

      {/* Bottom gradient bar - changes color based on price movement */}
      {/* <div
        className={`h-1 w-full ${
          isPriceUp ? "bg-emerald-500" : "bg-rose-500"
        } group-hover:opacity-100 opacity-70 transition-opacity duration-300`}
      /> */}
    </motion.div>
  );
};

export default ProjectCard;
