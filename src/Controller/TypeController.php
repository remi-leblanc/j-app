<?php

namespace App\Controller;

use App\Entity\Type;
use App\Form\TypeType;
use App\Repository\TypeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/admin/type")
 */
class TypeController extends AbstractController
{
    /**
     * @Route("/", name="type_index", methods={"GET"})
     */
    public function index(TypeRepository $typeRepository): Response
    {
        return $this->render('type/index.html.twig', [
            'types' => $typeRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="type_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $type = new Type();
        $form = $this->createForm(TypeType::class, $type);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($type);
            $entityManager->flush();

            return $this->redirectToRoute('type_index');
        }

        return $this->render('type/new.html.twig', [
            'type' => $type,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="type_show", methods={"GET"})
     */
    public function show(Type $type): Response
    {
        return $this->render('type/show.html.twig', [
            'type' => $type,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="type_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Type $type): Response
    {
        $form = $this->createForm(TypeType::class, $type);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();
            if($request->request->get('btn_action') == 'split_group_empty'){
                return $this->splitGroupProcess($type, false);
            }
            elseif($request->request->get('btn_action') == 'split_group_remap'){
                return $this->splitGroupProcess($type, true);
            }
            else{
                return $this->redirectToRoute('type_index');
            }
        }

        return $this->render('type/edit.html.twig', [
            'type' => $type,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="type_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Type $type): Response
    {
        if ($this->isCsrfTokenValid('delete'.$type->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();

            foreach($type->getWords() as $word){
                $word->setType(NULL);
            }

            $entityManager->remove($type);
            $entityManager->flush();
        }

        return $this->redirectToRoute('type_index');
    }


    public function splitGroupProcess(Type $type, bool $remapAllWords = false)
    {
        $words = $type->getWords();
        $wordGroups = [];
        $processed = [];

        //Pour chaque mot, on stocke son groupe et on génère un nombre aléatoire compris entre 0 et le nb de mot
        foreach($words as $word){
            $group = $word->getSplitGroup();
            if(!is_null($group)){
                $wordGroups[] = $group;
            }
            $rand = rand(0, count($words)-1);
            while(in_array($rand, $processed)){
                $rand = rand(0, count($words)-1);
            }
            $processed[] = $rand;
        }
        
        //On récupère le nombre de mot pour chaque groupe différent
        if($remapAllWords){
            $splitGroups = [];
        }
        else{
            $splitGroups = array_count_values($wordGroups);
        }

        /* FEATURE EN ATTENTE
        //Si les premiers groupes on des places de libre, on transfère vers ce groupe un mot du dernier groupe
        foreach($splitGroups as $group => $count){
            $lastGroup = count($splitGroups) - 1;
            while($count < $type->getSplitGroupSize() && $lastGroup != $group && $splitGroups[$lastGroup] > 0){
                $wordInLastGroup = $words->filter(function($word) use ($lastGroup) {
                    return $word->getSplitGroup() === $lastGroup;
                })->first();
                $wordInLastGroup->setSplitGroup($group);
                $count++;
                $splitGroups[$group]++;
                $splitGroups[$lastGroup]--;
                if($splitGroups[$lastGroup] === 0){
                    unset($splitGroups[$lastGroup]);
                }
                $lastGroup = count($splitGroups) - 1;
            }
        }
        */
        
        //On set le premier groupe disposant d'une place libre à un mot aléatoire
        foreach($processed as $rand){
            if(!$remapAllWords && !is_null($words[$rand]->getSplitGroup())){
                continue;
            }
            $group = 0;
            while(isset($splitGroups[$group]) && $splitGroups[$group] >= $type->getSplitGroupSize()){
                $group++;
            }
            if(!isset($splitGroups[$group])){
                $splitGroups[$group] = 0;
            }
            $splitGroups[$group]++;
            $type->setSplitGroupCount(count($splitGroups));
            $words[$rand]->setSplitGroup($group);
        }

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->flush();

        return $this->redirectToRoute('type_index');
    }
}
