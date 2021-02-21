<?php

namespace App\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use App\Entity\Word;
use App\Repository\WordRepository;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class ApiController extends AbstractController
{
    
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