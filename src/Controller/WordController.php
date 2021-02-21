<?php

namespace App\Controller;

use App\Entity\Word;
use App\Entity\Type;
use App\Entity\Theme;
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
     * @Route("/new", name="word_new")
     */
    public function new(Request $request): Response
    {
        $wordRepository = $this->getDoctrine()->getRepository(Word::class);
        $typeRepository = $this->getDoctrine()->getRepository(Type::class);
        $themeRepository = $this->getDoctrine()->getRepository(Theme::class);
        
        $word = new Word();
        if($type = $request->query->get('type')){
            $word->setType( $typeRepository->find($type) );
        }
        if($theme = $request->query->get('theme')){
            $word->setTheme( $themeRepository->find($theme) );
        } 
        $form = $this->createForm(WordType::class, $word);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $formData = $form->getData();
            
            $date = new \DateTime('now', new \DateTimeZone('Europe/Paris'));
            $word->setCreatedAt($date);
            
            $defaultFieldsValues = [
                'type' => null,
                'theme' => null,
            ];
            if($formData->getType()){
                if($formData->getType()->getName() != 'Verbe'){
                    $word->setVerbeGroupe(null);
                }
                $defaultFieldsValues['type'] = $formData->getType()->getId();
            }
            if($formData->getTheme()){
                $defaultFieldsValues['theme'] = $formData->getTheme()->getId();
            }

            $wordKanji = $formData->getKanji();
            if(!$wordRepository->findOneBy(['kanji' => $wordKanji]) ){
                $entityManager = $this->getDoctrine()->getManager();
                $entityManager->persist($word);
                $entityManager->flush();
                return $this->redirectToRoute('word_new', [
                    'type' => $defaultFieldsValues['type'],
                    'theme' => $defaultFieldsValues['theme']
                ]);
            }
        }

        $words = $wordRepository->findAll();

        return $this->render('word/new.html.twig', [
            'word' => $word,
            'words' => $words,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="word_show", requirements={"id":"\d+"}, methods={"GET"})
     */
    public function show(Word $word): Response
    {
        return $this->render('word/show.html.twig', [
            'word' => $word,
        ]);
    }

    /**
     * @Route("/{id}/edit/{redirect}", defaults={"redirect"="word_index"}, name="word_edit", requirements={"id":"\d+"}, methods={"GET","POST"})
     */
    public function edit(Request $request, Word $word, string $redirect): Response
    {
        $form = $this->createForm(WordType::class, $word);
        $form->handleRequest($request);

        $wordRepository = $this->getDoctrine()->getRepository(Word::class);

        if ($form->isSubmitted() && $form->isValid()) {
            $wordKanji = $form->getData()->getKanji();
            if(!$wordRepository->findOneBy(['kanji' => $wordKanji]) ){
                $this->getDoctrine()->getManager()->flush();
            }
            if($redirect == "next"){
                $wordRepository = $this->getDoctrine()->getRepository(Word::class);
                $query = $wordRepository->createQueryBuilder('w')->where('w.id >'.$word->getId())->orderBy('w.id', 'ASC')->setMaxResults(1);
                $nextWord = $query->getQuery()->getSingleResult();
                return $this->redirectToRoute('word_edit', ['id' => $nextWord->getId(), 'redirect' => 'next']);
            }
            else{
                return $this->redirectToRoute($redirect);
            }
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

        $words = $wordRepository->findAll();
        return $this->render('word/edit.html.twig', [
            'word' => $word,
            'words' => $words,
            'form' => $form->createView(),
            'selectionForm' => $selectionForm->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="word_delete", requirements={"id":"\d+"}, methods={"DELETE"})
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

    /**
	* @Route("/update-jmdict-data", name="word_update_jmdict_data")
	*/
    public function updateJmdictData(WordRepository $wordRepository)
    {
        $fileUrl = $this->getParameter('kernel.project_dir').'/db-dict/JMdict-1.json';
        $JMdictJson = json_decode(file_get_contents($fileUrl), true);

        $words = $wordRepository->findAll();
        foreach($words as $word){
            $kanji = str_replace('-', '', $word->getKanji());
            $kana = str_replace('-', '', $word->getKana());

            $findWord = null;
            foreach($JMdictJson as $entry){
                if(in_array($kanji, $entry['kanji']) || in_array($kanji, $entry['kana'])){
                    $findWord = $entry;
                    if(in_array($kana, $entry['kana'])){
                        break;
                    }
                }
            }
            if($findWord){
                $word->setJmdictCommon($findWord['is_common']);
                $word->setJmdictKana($findWord['usually_kana']);
            }
            else{
                $word->setJmdictCommon(false);
            }
        }
        $this->getDoctrine()->getManager()->flush();
        return $this->redirectToRoute('admin_dashboard');
    }

    /**
	* @Route("/analyse", name="word_analyse_jmdict")
	*/
    public function analyse(WordRepository $wordRepository)
    {
        $analyse = [];
        $words = $wordRepository->findAll();
        $fileUrl = $this->getParameter('kernel.project_dir').'/db-dict/JMdict-1.json';
        $JMdictJson = json_decode(file_get_contents($fileUrl), true);
        foreach($words as $word){
            $wordId = $word->getId();
            $kanji = $word->getKanji();
            $kana = $word->getKana();

            $findWord = null;
            $analyse[$wordId] = [];
            $analyse[$wordId]['kanji'] = $kanji;
            $analyse[$wordId]['kana'] = $kana;
            $analyse[$wordId]['may_be_wrong'] = true;

            foreach($JMdictJson as $entry){
                if(in_array($kanji, $entry['kanji']) || in_array($kanji, $entry['kana'])){
                    $findWord = $entry;
                    if(in_array($kana, $entry['kana'])){
                        $analyse[$wordId]['may_be_wrong'] = false;
                        break;
                    }
                }
            }
            if($findWord){
                $analyse[$wordId]['is_found'] = true;
                $analyse[$wordId]['is_common'] = $findWord['is_common'];
                $analyse[$wordId]['usually_kana'] = $findWord['usually_kana'];
                $analyse[$wordId]['jmdict_entry'] = $findWord['jmdict_entry'];
            }
            else{
                $analyse[$wordId]['is_found'] = false;
            }
        }
        return $this->render('admin-analyse.html.twig', [
            'words' => $analyse,
        ]);
    }
}
