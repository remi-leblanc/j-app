<?php

namespace App\Controller;

use App\Entity\MapLocation;
use App\Repository\MapLocationRepository;
use App\Form\MapLocationType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/admin/location")
 */
class MapLocationController extends AbstractController
{

    /**
     * @Route("/", name="location_index", methods={"GET"})
     */
    public function index(MapLocationRepository $locRepository): Response
    {
        return $this->render('map_location/index.html.twig', [
            'locs' => $locRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="location_new")
     */
    public function new(Request $request): Response
    {
        $loc = new MapLocation();
        $locRepository = $this->getDoctrine()->getRepository(MapLocation::class);

        if($type = $request->query->get('type')){
            $loc->setType($type);
        }
        
        $form = $this->createForm(MapLocationType::class, $loc);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $formData = $form->getData();
            
            $defaultFieldsValues = [
                'type' => 0,
            ];
            if($formData->getType()){
                $defaultFieldsValues['type'] = $formData->getType();
            }

            $nameJp = $formData->getNameJp();
            if(!$locRepository->findOneBy(['nameJp' => $formData->getNameJp(), 'type' => $formData->getType()])){
                $entityManager = $this->getDoctrine()->getManager();
                $entityManager->persist($loc);
                $entityManager->flush();
                return $this->redirectToRoute('location_new', [
                    'type' => $defaultFieldsValues['type'],
                ]);
            }
        }

        $locs = $locRepository->findAll();

        return $this->render('map_location/new.html.twig', [
            'loc' => $loc,
            'locs' => $locs,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}/edit/{redirect}", defaults={"redirect"="location_index"}, name="location_edit", requirements={"id":"\d+"}, methods={"GET","POST"})
     */
    public function edit(Request $request, MapLocation $loc, string $redirect): Response
    {
        $form = $this->createForm(MapLocationType::class, $loc);
        $form->handleRequest($request);

        $locRepository = $this->getDoctrine()->getRepository(MapLocation::class);

        if ($form->isSubmitted() && $form->isValid()) {
            $nameJp = $form->getData()->getNameJp();
            if(count($locRepository->findBy(['nameJp' => $nameJp])) < 2 ){
                $this->getDoctrine()->getManager()->flush();
            }
            if($redirect == "next"){
                $query = $locRepository->createQueryBuilder('l')->where('l.id >'.$loc->getId())->orderBy('l.id', 'ASC')->setMaxResults(1);
                $nextLoc = $query->getQuery()->getSingleResult();
                return $this->redirectToRoute('location_edit', ['id' => $nextLoc->getId(), 'redirect' => 'next']);
            }
            else{
                return $this->redirectToRoute($redirect);
            }
        }


        $locs = $locRepository->findAll();
        return $this->render('map_location/edit.html.twig', [
            'loc' => $loc,
            'locs' => $locs,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="location_delete", requirements={"id":"\d+"}, methods={"DELETE"})
     */
    public function delete(Request $request, MapLocation $loc): Response
    {
        if ($this->isCsrfTokenValid('delete'.$loc->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($loc);
            $entityManager->flush();
        }

        return $this->redirectToRoute('location_index');
    }
}
