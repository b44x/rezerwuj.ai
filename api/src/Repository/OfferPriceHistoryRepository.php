<?php

namespace App\Repository;

use App\Entity\Offer;
use App\Entity\OfferPriceHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<OfferPriceHistory>
 */
class OfferPriceHistoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, OfferPriceHistory::class);
    }

    /**
     * Get price history for an offer
     * @return OfferPriceHistory[]
     */
    public function findByOffer(Offer $offer, int $limit = 30): array
    {
        return $this->createQueryBuilder('ph')
            ->andWhere('ph.offer = :offer')
            ->setParameter('offer', $offer)
            ->orderBy('ph.checkedAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Get latest price record for an offer
     */
    public function findLatestForOffer(Offer $offer): ?OfferPriceHistory
    {
        return $this->createQueryBuilder('ph')
            ->andWhere('ph.offer = :offer')
            ->setParameter('offer', $offer)
            ->orderBy('ph.checkedAt', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Get price change statistics for an offer
     */
    public function getPriceChangeStats(Offer $offer): array
    {
        $history = $this->findByOffer($offer, 2);

        if (count($history) < 2) {
            return [
                'trend' => 'stable',
                'amount' => 0,
                'percentage' => 0,
            ];
        }

        $current = (float) $history[0]->getPrice();
        $previous = (float) $history[1]->getPrice();

        $amount = $current - $previous;
        $percentage = $previous > 0 ? (($amount / $previous) * 100) : 0;

        $trend = 'stable';
        if ($amount > 0) {
            $trend = 'up';
        } elseif ($amount < 0) {
            $trend = 'down';
        }

        return [
            'trend' => $trend,
            'amount' => $amount,
            'percentage' => $percentage,
        ];
    }
}
