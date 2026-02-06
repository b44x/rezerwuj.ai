<?php

namespace App\Repository;

use App\Entity\TravelGroup;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TravelGroup>
 *
 * @method TravelGroup|null find($id, $lockMode = null, $lockVersion = null)
 * @method TravelGroup|null findOneBy(array $criteria, array $orderBy = null)
 * @method TravelGroup[]    findAll()
 * @method TravelGroup[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TravelGroupRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TravelGroup::class);
    }
}
