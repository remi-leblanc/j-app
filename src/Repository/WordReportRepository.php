<?php

namespace App\Repository;

use App\Entity\WordReport;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method WordReport|null find($id, $lockMode = null, $lockVersion = null)
 * @method WordReport|null findOneBy(array $criteria, array $orderBy = null)
 * @method WordReport[]    findAll()
 * @method WordReport[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WordReportRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, WordReport::class);
    }

    // /**
    //  * @return WordReport[] Returns an array of WordReport objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('w')
            ->andWhere('w.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('w.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?WordReport
    {
        return $this->createQueryBuilder('w')
            ->andWhere('w.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
