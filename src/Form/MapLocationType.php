<?php

namespace App\Form;

use App\Entity\MapLocation;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

use Doctrine\ORM\EntityManagerInterface;

class MapLocationType extends AbstractType
{

    private $em;

    public function __construct(EntityManagerInterface $em) {

        $this->em = $em;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nameJp', TextType::class, [
                'attr' => [
                    'placeholder' => 'Nom JP',
                    'class' => 'unique-field'
                ]
            ])
            ->add('nameFr', TextType::class, [
                'attr' => [
                    'placeholder' => 'Nom FR'
                ],
            ])
            ->add('type', ChoiceType::class, [
                'choices' => array_merge(['Type' => 0], MapLocation::MAPLOCATION_TYPES)
            ])
            ->add('latitude', TextType::class, [
                'attr' => [
                    'placeholder' => 'Latitude'
                ],
                'required' => false,
            ])
            ->add('longitude', TextType::class, [
                'attr' => [
                    'placeholder' => 'Longitude'
                ],
                'required' => false,
            ])
        ;

    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => MapLocation::class,
        ]);
    }
}
