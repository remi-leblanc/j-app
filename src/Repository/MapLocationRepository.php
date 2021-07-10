<?php

namespace App\Repository;

use App\Entity\MapLocation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method MapLocation|null find($id, $lockMode = null, $lockVersion = null)
 * @method MapLocation|null findOneBy(array $criteria, array $orderBy = null)
 * @method MapLocation[]    findAll()
 * @method MapLocation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MapLocationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MapLocation::class);
    }

    // /**
    //  * @return MapLocation[] Returns an array of MapLocation objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('m.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?MapLocation
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
