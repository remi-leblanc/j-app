<?php

namespace App\Controller;

use App\Entity\WordReport;
use App\Form\WordReportType;
use App\Repository\WordReportRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/admin/word_report")
 */
class WordReportController extends AbstractController
{
    /**
     * @Route("/", name="word_report_index", methods={"GET"})
     */
    public function index(WordReportRepository $wordReportRepository): Response
    {
        return $this->render('word_report/index.html.twig', [
            'word_reports' => $wordReportRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="word_report_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $wordReport = new WordReport();
        $form = $this->createForm(WordReportType::class, $wordReport);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($wordReport);
            $entityManager->flush();

            return $this->redirectToRoute('word_report_index');
        }

        return $this->render('word_report/new.html.twig', [
            'word_report' => $wordReport,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="word_report_show", methods={"GET"})
     */
    public function show(WordReport $wordReport): Response
    {
        return $this->render('word_report/show.html.twig', [
            'word_report' => $wordReport,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="word_report_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, WordReport $wordReport): Response
    {
        $form = $this->createForm(WordReportType::class, $wordReport);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('word_report_index');
        }

        return $this->render('word_report/edit.html.twig', [
            'word_report' => $wordReport,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="word_report_delete", methods={"DELETE"})
     */
    public function delete(Request $request, WordReport $wordReport): Response
    {
        if ($this->isCsrfTokenValid('delete'.$wordReport->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($wordReport);
            $entityManager->flush();
        }

        return $this->redirectToRoute('word_report_index');
    }
}
