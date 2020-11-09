<?php

namespace App\Controller;

use App\Entity\Word;
use App\Form\WordType;
use App\Repository\WordRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

/**
 * @Route("/admin/word")
 */
class WordController extends AbstractController
{

    /**
     * @Route("/", name="word_index", methods={"GET"})
     */
    public function index(WordRepository $wordRepository): Response
    {
        return $this->render('word/index.html.twig', [
            'words' => $wordRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="word_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $errorMessage = null;
        $repository = $this->getDoctrine()->getRepository(Word::class);

        $word = new Word();
        $form = $this->createForm(WordType::class, $word);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $formData = $form->getData();
            
            $date = new \DateTime('now', new \DateTimeZone('Europe/Paris'));
            $word->setCreatedAt($date);
            
            if($formData->getType() && $formData->getType()->getName() != 'Verbe'){
                $word->setVerbeGroupe(null);
            }

            $wordKanji = $formData->getKanji();

            $isWordExist = $repository->findOneBy(['kanji' => $wordKanji]);

            if($isWordExist){
                $errorMessage = 'Ce mot est déjà enregistré.';
            }
            else{
                $entityManager = $this->getDoctrine()->getManager();
                $entityManager->persist($word);
                $entityManager->flush();

                return $this->redirectToRoute('word_new');
            }
            
            
        }

        return $this->render('word/new.html.twig', [
            'word' => $word,
            'form' => $form->createView(),
            'errorMessage' => $errorMessage,
        ]);
    }

    /**
     * @Route("/{id}", name="word_show", methods={"GET"})
     */
    public function show(Word $word): Response
    {
        return $this->render('word/show.html.twig', [
            'word' => $word,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="word_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Word $word): Response
    {
        $form = $this->createForm(WordType::class, $word);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('word_index');
        }

        $selectionForm = $this->get('form.factory')->createNamedBuilder('selectionForm')
        ->add('selection', HiddenType::class, [
            'data' => $word->getId(),
        ])
        ->add('submit', SubmitType::class, [
            'label' => 'Tester le mot'
        ])
        ->setAction($this->generateUrl('app'))
        ->getForm();

        return $this->render('word/edit.html.twig', [
            'word' => $word,
            'form' => $form->createView(),
            'selectionForm' => $selectionForm->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="word_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Word $word): Response
    {
        if ($this->isCsrfTokenValid('delete'.$word->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($word);
            $entityManager->flush();
        }

        return $this->redirectToRoute('word_index');
    }
}
