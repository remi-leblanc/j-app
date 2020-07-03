<?php

namespace App\Repository;

use App\Entity\Conjugaison;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Conjugaison|null find($id, $lockMode = null, $lockVersion = null)
 * @method Conjugaison|null findOneBy(array $criteria, array $orderBy = null)
 * @method Conjugaison[]    findAll()
 * @method Conjugaison[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ConjugaisonRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Conjugaison::class);
    }

    // /**
    //  * @return Conjugaison[] Returns an array of Conjugaison objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Conjugaison
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
