<?php

namespace App\Form;

use App\Entity\WordReport;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

class WordReportType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('description', TextareaType::class, [
                'attr' => [
                    'placeholder' => 'Décrivez l\'erreur que vous rencontrez (traduction, coquille, incomplet...)',
                    'rows' => '7',
                ],
                'required' => false,
            ])
            ->add('word', HiddenType::class, [
 
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => WordReport::class,
        ]);
    }
}
