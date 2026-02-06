<?php

namespace App\Repository;

use App\Entity\TravelProfile;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TravelProfile>
 *
 * @method TravelProfile|null find($id, $lockMode = null, $lockVersion = null)
 * @method TravelProfile|null findOneBy(array $criteria, array $orderBy = null)
 * @method TravelProfile[]    findAll()
 * @method TravelProfile[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TravelProfileRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TravelProfile::class);
    }

    //    /**
    //     * @return TravelProfile[] Returns an array of TravelProfile objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('t.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?TravelProfile
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
