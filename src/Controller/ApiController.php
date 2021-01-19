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
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ApiController extends AbstractController
{

    /**
	* @Route("/admin/analyse/{page}", defaults={"page"=1}, name="admin_analyse")
	*/
    public function analyse(HttpClientInterface $client, WordRepository $wordRepository, int $page)
    {

        $analyse = $this->getAnalyse($page);

        return $this->render('admin-analyse.html.twig', [
            'words' => $analyse,
        ]);
    }

    public function getAnalyse(int $page = 1, int $perPage = 100)
    {
        $JMdictPage = 1;
        //$JLPT = json_decode(file_get_contents($this->getParameter('kernel.project_dir').'/db-dict/JLPT-Global.json'), true);
        $analyse = [];

        $wordCount = 0;
        $words = $this->getDoctrine()->getRepository(Word::class)->findAll();
        foreach($words as $word){
            if($wordCount < ($page * $perPage) - $perPage){
                $wordCount++;
                continue;
            }
            $wordId = $word->getId();
            $kanji = $word->getKanji();
            $kana = $word->getKana();

            $findWord = null;
            $analyse[$wordId] = [];
            $analyse[$wordId]['kanji'] = $kanji;
            $analyse[$wordId]['kana'] = $kana;
            $analyse[$wordId]['may_be_wrong'] = true;

            while($analyse[$wordId]['may_be_wrong']){
                $fileUrl = $this->getParameter('kernel.project_dir').'/db-dict/JMdict-'.$JMdictPage.'.json';
                if(file_exists($fileUrl)){
                    $JMdictJson = json_decode(file_get_contents($fileUrl), true);
                }
                else{
                    break;
                }
                foreach($JMdictJson as $entry){
                    if(in_array($kanji, $entry['kanji']) || in_array($kanji, $entry['kana'])){
                        $findWord = $entry;
                        if(in_array($kana, $entry['kana'])){
                            $analyse[$wordId]['may_be_wrong'] = false;
                            break;
                        }
                    }
                }
                $JMdictPage++;
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
            $JMdictPage = 1;

            if($wordCount + 1 >= $page * $perPage){
                break;
            }
            $wordCount++;
        }   
        return $analyse;
    }

    /**
	* @Route("/api/getJsonFromJMdictXML")
	*/
    public function getJsonFromJMdictXMLAPI()
    {
        $JMdictJson = $this->getJsonFromJMdictXML(true, false, false);
        return new Response(json_encode($JMdictJson, JSON_UNESCAPED_UNICODE));
    }

    public function getJsonFromJMdictXML(bool $onlyCommon = true, bool $getTrad = true, bool $onlyFrench = false)
    {
        $JMdictJson = [];
        $dbEntryTypes = [
            "k" => "kanji",
            "r" => "kana",
        ];

        $reader = new \XMLReader();
        $dom = new \DOMDocument();
        $xpath = new \DOMXPath($dom);

        $reader->open($this->getParameter('kernel.project_dir').'/db-dict/JMdict');
        $reader->setParserProperty(\XMLReader::SUBST_ENTITIES, true); 

        while ($reader->read() && $reader->name != 'entry');
        while($reader->name == 'entry'){
            $node = $reader->expand($dom);
            $wordData = [
                "jmdict_entry" => $xpath->evaluate('ent_seq', $node)[0]->nodeValue,
                "kanji" => [],
                "kana" => [],
                "trad" => [],
                "is_common" => false,
                "usually_kana" => false,
                "usually_kana" => false,
            ];
        
            $haveTrad = false;

            $dbEntrySenses = $xpath->evaluate('sense', $node);

            foreach($dbEntrySenses as $sense){
                $dbEntryGlosses = $xpath->evaluate('gloss', $sense);
                foreach($dbEntryGlosses as $gloss){
                    if($gloss->attributes[0] && $gloss->attributes[0]->nodeName == "xml:lang" && $gloss->attributes[0]->nodeValue == "fre"){
                        if($getTrad){
                            array_push($wordData['trad'], $gloss->nodeValue);
                        }
                        $haveTrad = true;
                    }
                }
                if(!empty($wordData['trad'])){
                    break;
                }
            }
            if(!$onlyFrench || $haveTrad){
                foreach($dbEntryTypes as $tCode => $tName){
                    $dbEntryElements = $xpath->evaluate($tCode.'_ele', $node);
                    foreach($dbEntryElements as $ele){
                        $currEleIsCommon = false;
                        if( $xpath->evaluate($tCode.'e_pri', $ele)->length ){
                            $currEleIsCommon = true;
                            $wordData['is_common'] = true;
                        }
                        if(!$onlyCommon || $currEleIsCommon){
                            $dbEntryWords = $xpath->evaluate($tCode.'eb', $ele);
                            if($dbEntryWords->length){
                                array_push($wordData[$tName], $dbEntryWords[0]->nodeValue);
                            }
                        }
                    }
                }
                if(!$onlyCommon || $wordData['is_common']){
                    foreach($xpath->evaluate('misc', $dbEntrySenses[0]) as $misc){
                        if($misc->nodeValue == "word usually written using kana alone"){
                            $wordData['usually_kana'] = true;
                        }
                    }
                    if(!$xpath->evaluate('k_ele', $node)->length){
                        $wordData['usually_kana'] = true;
                    }
                    array_push($JMdictJson, $wordData);
                }
            }
            $reader->next('entry');
        }
        $reader->close();

        return $JMdictJson;
    }

    public function getFromJishoAPI(HttpClientInterface $client, WordRepository $wordRepository)
	{   
        $words = $wordRepository->findAll();

        $return = [];

        $urls = [];
        $curly = [];

        $mh = curl_multi_init();

        foreach($words as $id => $word){
            $curly[$id] = curl_init();
            curl_setopt($curly[$id], CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curly[$id], CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curly[$id], CURLOPT_URL, 'https://jisho.org/api/v1/search/words?keyword='.urlencode($word->getKanji()));

            curl_multi_add_handle($mh, $curly[$id]);
        }
       
        $running = null;
        do{
            curl_multi_exec($mh, $running);
        } while($running > 0);
        foreach($curly as $id => $c) {
            $return[$id] = json_decode(curl_multi_getcontent($c), true);
            curl_multi_remove_handle($mh, $c);
        }
        curl_multi_close($mh);

        return new Response(json_encode($return, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));
    }
}