<?php

namespace App\Repository;

use App\Entity\RecentlyViewed;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RecentlyViewed>
 *
 * @method RecentlyViewed|null find($id, $lockMode = null, $lockVersion = null)
 * @method RecentlyViewed|null findOneBy(array $criteria, array $orderBy = null)
 * @method RecentlyViewed[]    findAll()
 * @method RecentlyViewed[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RecentlyViewedRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RecentlyViewed::class);
    }

    /**
     * Find recently viewed hotels for a user
     * @return RecentlyViewed[]
     */
    public function findRecentByUser(User $user, int $limit = 10): array
    {
        return $this->createQueryBuilder('rv')
            ->andWhere('rv.user = :user')
            ->setParameter('user', $user)
            ->orderBy('rv.viewedAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Check if user already viewed a hotel recently (within last hour)
     */
    public function hasRecentView(User $user, int $hotelId): bool
    {
        $oneHourAgo = new \DateTimeImmutable('-1 hour');

        $count = $this->createQueryBuilder('rv')
            ->select('COUNT(rv.id)')
            ->join('rv.hotel', 'h')
            ->andWhere('rv.user = :user')
            ->andWhere('h.id = :hotelId')
            ->andWhere('rv.viewedAt >= :oneHourAgo')
            ->setParameter('user', $user)
            ->setParameter('hotelId', $hotelId)
            ->setParameter('oneHourAgo', $oneHourAgo)
            ->getQuery()
            ->getSingleScalarResult();

        return $count > 0;
    }

    /**
     * Get popular hotels (most viewed)
     * @return array
     */
    public function findMostViewed(int $limit = 10): array
    {
        return $this->createQueryBuilder('rv')
            ->select('h.id, h.name, h.slug, COUNT(rv.id) as viewCount')
            ->join('rv.hotel', 'h')
            ->groupBy('h.id')
            ->orderBy('viewCount', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
