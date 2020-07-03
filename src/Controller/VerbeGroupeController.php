<?php

namespace App\Controller;

use App\Entity\VerbeGroupe;
use App\Form\VerbeGroupeType;
use App\Repository\VerbeGroupeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/admin/verbe_groupe")
 */
class VerbeGroupeController extends AbstractController
{
    /**
     * @Route("/", name="verbe_groupe_index", methods={"GET"})
     */
    public function index(VerbeGroupeRepository $verbeGroupeRepository): Response
    {
        return $this->render('verbe_groupe/index.html.twig', [
            'verbe_groupes' => $verbeGroupeRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="verbe_groupe_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $verbeGroupe = new VerbeGroupe();
        $form = $this->createForm(VerbeGroupeType::class, $verbeGroupe);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($verbeGroupe);
            $entityManager->flush();

            return $this->redirectToRoute('verbe_groupe_index');
        }

        return $this->render('verbe_groupe/new.html.twig', [
            'verbe_groupe' => $verbeGroupe,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="verbe_groupe_show", methods={"GET"})
     */
    public function show(VerbeGroupe $verbeGroupe): Response
    {
        return $this->render('verbe_groupe/show.html.twig', [
            'verbe_groupe' => $verbeGroupe,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="verbe_groupe_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, VerbeGroupe $verbeGroupe): Response
    {
        $form = $this->createForm(VerbeGroupeType::class, $verbeGroupe);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('verbe_groupe_index');
        }

        return $this->render('verbe_groupe/edit.html.twig', [
            'verbe_groupe' => $verbeGroupe,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="verbe_groupe_delete", methods={"DELETE"})
     */
    public function delete(Request $request, VerbeGroupe $verbeGroupe): Response
    {
        if ($this->isCsrfTokenValid('delete'.$verbeGroupe->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($verbeGroupe);
            $entityManager->flush();
        }

        return $this->redirectToRoute('verbe_groupe_index');
    }
}
