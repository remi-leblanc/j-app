<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

use App\Entity\User;
use App\Repository\UserRepository;

use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {

        $this->passwordEncoder = $passwordEncoder;

    }

    public function load(ObjectManager $manager)
    {
        $user = new User();
        $user->setEmail('kronix.powa@gmail.com');
        $user->setUsername('KroNawak');
        $user->setRoles(['ROLE_ADMIN']);
        $userPassword = $this->passwordEncoder->encodePassword($user, 'tousdesnoob77');
        $user->setPassword($userPassword);
        $manager->persist($user);
        $manager->flush();
    }
}
