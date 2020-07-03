<?php

namespace App\Repository;

use App\Entity\FormePolie;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method FormePolie|null find($id, $lockMode = null, $lockVersion = null)
 * @method FormePolie|null findOneBy(array $criteria, array $orderBy = null)
 * @method FormePolie[]    findAll()
 * @method FormePolie[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FormePolieRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FormePolie::class);
    }

    // /**
    //  * @return FormePolie[] Returns an array of FormePolie objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('f.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?FormePolie
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
