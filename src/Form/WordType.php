<?php

namespace App\Form;

use App\Entity\Word;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Type;

use App\Entity\VerbeGroupe;

use App\Entity\Theme;

class WordType extends AbstractType
{

    private $em;

    public function __construct(EntityManagerInterface $em) {

        $this->em = $em;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('kanji', TextType::class, [
                'attr' => [
                    'placeholder' => 'Kanji',
                    'class' => 'unique-field'
                ]
            ])
            ->add('kana', TextType::class, [
                'attr' => [
                    'placeholder' => 'Kana'
                ],
                'required' => false,
            ])
            ->add('romaji', TextType::class, [
                'attr' => [
                    'placeholder' => 'Romaji'
                ]
            ])
            ->add('francais', TextType::class, [
                'attr' => [
                    'placeholder' => 'Français'
                ]
            ])
            ->add('type', EntityType::class, [
                'class' => Type::class,
                'choice_label' => 'name',
                'attr' => [
                    'class' => 'cond-emitter',
                    'data-cond-link' => 'types'
                ],
                'placeholder' => 'Type de mot',
                'required' => false,
            ])
            ->add('verbe_groupe', EntityType::class, [
                'class' => VerbeGroupe::class,
                'choice_label' => 'name',
                'placeholder' => 'Groupe du verbe',
                'required' => false,
            ])
            ->add('theme', EntityType::class, [
                'class' => Theme::class,
                'choice_label' => 'name',
                'placeholder' => 'Thème',
                'required' => false,
                /* 'preferred_choices' => [$this->em->getRepository(Theme::class)->findOneBy(['name' => 'Autre'])], */
            ])
            ->add('infos', TextType::class, [
                'attr' => [
                    'placeholder' => 'Infos supplémentaires'
                ],
                'required' => false,
            ])
        ;

    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Word::class,
        ]);
    }
}
