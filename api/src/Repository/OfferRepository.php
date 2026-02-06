<?php

namespace App\Repository;

use App\Entity\Offer;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Offer>
 */
class OfferRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Offer::class);
    }

    /**
     * Find offers with filters
     * @return Offer[]
     */
    public function findWithFilters(
        ?string $departureCity = null,
        ?\DateTimeImmutable $departureDateFrom = null,
        ?\DateTimeImmutable $departureDateTo = null,
        ?int $durationDays = null,
        ?float $priceMin = null,
        ?float $priceMax = null,
        ?string $boardType = null,
        ?string $providerId = null,
        int $limit = 50,
        int $offset = 0
    ): array {
        $qb = $this->createQueryBuilder('o')
            ->join('o.hotel', 'h')
            ->join('o.provider', 'p')
            ->where('o.isActive = :active')
            ->setParameter('active', true);

        if ($departureCity) {
            $qb->andWhere('o.departureCity = :city')
               ->setParameter('city', $departureCity);
        }

        if ($departureDateFrom) {
            $qb->andWhere('o.departureDate >= :dateFrom')
               ->setParameter('dateFrom', $departureDateFrom);
        }

        if ($departureDateTo) {
            $qb->andWhere('o.departureDate <= :dateTo')
               ->setParameter('dateTo', $departureDateTo);
        }

        if ($durationDays) {
            $qb->andWhere('o.durationDays = :duration')
               ->setParameter('duration', $durationDays);
        }

        if ($priceMin !== null) {
            $qb->andWhere('o.price >= :priceMin')
               ->setParameter('priceMin', $priceMin);
        }

        if ($priceMax !== null) {
            $qb->andWhere('o.price <= :priceMax')
               ->setParameter('priceMax', $priceMax);
        }

        if ($boardType) {
            $qb->andWhere('o.boardType = :boardType')
               ->setParameter('boardType', $boardType);
        }

        if ($providerId) {
            $qb->andWhere('p.id = :providerId')
               ->setParameter('providerId', $providerId);
        }

        return $qb->orderBy('o.price', 'ASC')
                  ->setMaxResults($limit)
                  ->setFirstResult($offset)
                  ->getQuery()
                  ->getResult();
    }

    /**
     * Count offers with filters
     */
    public function countWithFilters(
        ?string $departureCity = null,
        ?\DateTimeImmutable $departureDateFrom = null,
        ?\DateTimeImmutable $departureDateTo = null,
        ?int $durationDays = null,
        ?float $priceMin = null,
        ?float $priceMax = null,
        ?string $boardType = null,
        ?string $providerId = null
    ): int {
        $qb = $this->createQueryBuilder('o')
            ->select('COUNT(o.id)')
            ->join('o.provider', 'p')
            ->where('o.isActive = :active')
            ->setParameter('active', true);

        if ($departureCity) {
            $qb->andWhere('o.departureCity = :city')
               ->setParameter('city', $departureCity);
        }

        if ($departureDateFrom) {
            $qb->andWhere('o.departureDate >= :dateFrom')
               ->setParameter('dateFrom', $departureDateFrom);
        }

        if ($departureDateTo) {
            $qb->andWhere('o.departureDate <= :dateTo')
               ->setParameter('dateTo', $departureDateTo);
        }

        if ($durationDays) {
            $qb->andWhere('o.durationDays = :duration')
               ->setParameter('duration', $durationDays);
        }

        if ($priceMin !== null) {
            $qb->andWhere('o.price >= :priceMin')
               ->setParameter('priceMin', $priceMin);
        }

        if ($priceMax !== null) {
            $qb->andWhere('o.price <= :priceMax')
               ->setParameter('priceMax', $priceMax);
        }

        if ($boardType) {
            $qb->andWhere('o.boardType = :boardType')
               ->setParameter('boardType', $boardType);
        }

        if ($providerId) {
            $qb->andWhere('p.id = :providerId')
               ->setParameter('providerId', $providerId);
        }

        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    /**
     * Get unique departure cities
     * @return string[]
     */
    public function getUniqueDepartureCities(): array
    {
        $results = $this->createQueryBuilder('o')
            ->select('DISTINCT o.departureCity')
            ->where('o.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('o.departureCity', 'ASC')
            ->getQuery()
            ->getResult();

        return array_map(fn($r) => $r['departureCity'], $results);
    }

    /**
     * Get unique board types
     * @return string[]
     */
    public function getUniqueBoardTypes(): array
    {
        $results = $this->createQueryBuilder('o')
            ->select('DISTINCT o.boardType')
            ->where('o.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('o.boardType', 'ASC')
            ->getQuery()
            ->getResult();

        return array_map(fn($r) => $r['boardType'], $results);
    }
}
