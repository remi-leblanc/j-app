<?php

namespace App\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

use App\Entity\Type;
use App\Repository\TypeRepository;

use App\Entity\Word;
use App\Repository\WordRepository;

use App\Entity\VerbeGroupe;
use App\Repository\VerbeGroupeRepository;

use App\Entity\Theme;
use App\Repository\ThemeRepository;

use App\Entity\WordReport;
use App\Repository\WordReportRepository;
use App\Form\WordReportType;

class MainController extends AbstractController
{

	/**
	* @Route("/", name="selection")
	*/
	public function select()
	{

        $types = $this->getDoctrine()
        ->getRepository(Type::class)
        ->findAll();

        $themes = $this->getDoctrine()
        ->getRepository(Theme::class)
        ->findAll();

        $words = $this->getDoctrine()
        ->getRepository(Word::class)
        ->findAll();

        usort($words, function($a, $b) {
            $a = $a->getCreatedAt();
            $b = $b->getCreatedAt();
          
            if ($a == $b) {
              return 0;
            }

            return $a < $b ? -1 : 1;
        });

        $firstDate = new \DateTime($words[0]->getCreatedAt()->format('d-m-Y'));
        $lastDate = new \DateTime(end($words)->getCreatedAt()->format('d-m-Y'));
        $lastDate->modify('+1 day');

        $dateDiff = $firstDate->diff($lastDate)->days;

        $selectionForm = $this->get('form.factory')->createNamedBuilder('selectionForm')
			->add('selection', HiddenType::class)
            ->add('mode', HiddenType::class)
            ->add('method', HiddenType::class)
			->add('submit', SubmitType::class, [
                'label' => 'Commencer'
            ])
            ->setAction($this->generateUrl('app'))
            ->getForm();


        return $this->render('select.html.twig', [
            'words' => $words,
            'types' => $types,
            'firstDate' => $firstDate,
            'lastDate' => $lastDate,
            'dateDiff' => $dateDiff,
            'themes' => $themes,
            'selectionForm' => $selectionForm->createView(),
        ]);

    }
    
    /**
	* @Route("/app", name="app")
	*/
	public function app(Request $request)
	{

        $wordReport = new WordReport();
        $wordReportForm = $this->createForm(WordReportType::class, $wordReport);

        $data = $request->request->get('word_report');
        if($data){
            $word = $this->getDoctrine()->getRepository(Word::class)->find($data['word']);

            $wordReport->setDescription($data['description']);
            $wordReport->setWord($word);

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($wordReport);
            $entityManager->flush();

            return new Response();
        }

        $selectionFormData = $request->request->get('selectionForm');
        if ($selectionFormData == null) {
            return $this->redirectToRoute('selection');
        }
        else{
            $method = $selectionFormData['method'];
            if(!in_array($method, ['write', 'listen'])){
                return $this->redirectToRoute('selection');
            }
            $mode = $selectionFormData['mode'];
            if(!in_array($mode, ['hard', 'normal', 'numbers'])){
                return $this->redirectToRoute('selection');
            }
            if($mode == 'numbers'){
                return $this->render('app-numbers.html.twig', [
                    'method' => $method,
                ]);
            }
            $selectedWords = explode(',', $selectionFormData['selection']);
            if(count($selectedWords) < 1){
                return $this->redirectToRoute('selection');
            }
            $dbWords = $this->getDoctrine()->getRepository(Word::class)->findBy(
                ['id' => $selectedWords]
            );
            return $this->render('app.html.twig', [
                'dbWords' => $dbWords,
                'mode' => $mode,
                'method' => $method,
                'word_report' => $wordReport,
                'word_report_form' => $wordReportForm->createView(),
            ]);
        }
    }

    /**
	* @Route("/admin", name="admin_dashboard")
	*/
	public function admin()
	{

        $wordReports = $this->getDoctrine()->getRepository(WordReport::class)->findAll();

        return $this->render('admin.html.twig', [
            'word_reports' => $wordReports,
        ]);

    }

    /**
	* @Route("/notes", name="notes")
	*/
	public function notes()
	{
        return $this->render('learn.html.twig', [

        ]);

    }
}