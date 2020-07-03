<?php

namespace App\Repository;

use App\Entity\VerbeGroupe;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method VerbeGroupe|null find($id, $lockMode = null, $lockVersion = null)
 * @method VerbeGroupe|null findOneBy(array $criteria, array $orderBy = null)
 * @method VerbeGroupe[]    findAll()
 * @method VerbeGroupe[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VerbeGroupeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VerbeGroupe::class);
    }

    // /**
    //  * @return VerbeGroupe[] Returns an array of VerbeGroupe objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('v.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?VerbeGroupe
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
