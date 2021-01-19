<?php

namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

use Symfony\Component\HttpKernel\KernelInterface;

class JappJmdictProcessCommand extends Command
{
    protected static $defaultName = 'japp:jmdict:process';

    protected $projectDir;

    public function __construct(KernelInterface $kernel)
    {
        $this->projectDir = $kernel->getProjectDir();
        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setDescription('')
            ->setHelp('')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $dbEntryTypes = [
            "k" => "kanji",
            "r" => "kana",
        ];

        $reader = new \XMLReader();
        $dom = new \DOMDocument();
        $xpath = new \DOMXPath($dom);

        $reader->open($this->projectDir.'/db-dict/JMdict');
        $reader->setParserProperty(\XMLReader::SUBST_ENTITIES, true); 

        $i = 0;
        $page = 1;
        $JMdictJson = [];
        while ($reader->read() && $reader->name != 'entry');
        while($reader->name == 'entry'){
            $node = $reader->expand($dom);
            $wordData = [
                "jmdict_entry" => $xpath->evaluate('ent_seq', $node)[0]->nodeValue,
                "kanji" => [],
                "kana" => [],
                "senses" => [],
                "is_common" => false,
                "usually_kana" => false,
                "usually_kana" => false,
            ];

            // foreach($dbEntrySenses as $sense){
            //     $dbEntryGlosses = $xpath->evaluate('gloss', $sense);
            //     $trads = [];
            //     foreach($dbEntryGlosses as $gloss){
            //         if($gloss->attributes[0] && $gloss->attributes[0]->nodeName == "xml:lang" && $gloss->attributes[0]->nodeValue == "fre"){
            //             array_push($trads, $gloss->nodeValue);
            //         }
            //     }
            //     if(!empty($trads)){
            //         array_push($wordData['senses'], $trads);
            //     }
            // }
            foreach($dbEntryTypes as $tCode => $tName){
                $dbEntryElements = $xpath->evaluate($tCode.'_ele', $node);
                foreach($dbEntryElements as $ele){
                    if( $xpath->evaluate($tCode.'e_pri', $ele)->length ){
                        $wordData['is_common'] = true;
                    }
                    $dbEntryWords = $xpath->evaluate($tCode.'eb', $ele);
                    if($dbEntryWords->length){
                        array_push($wordData[$tName], $dbEntryWords[0]->nodeValue);
                    }
                }
            }
            $dbEntrySenses = $xpath->evaluate('sense', $node);
            foreach($xpath->evaluate('misc', $dbEntrySenses[0]) as $misc){
                if($misc->nodeValue == "word usually written using kana alone"){
                    $wordData['usually_kana'] = true;
                }
            }
            if(!$xpath->evaluate('k_ele', $node)->length){
                $wordData['usually_kana'] = true;
            }
            if($wordData['is_common']){
                $JMdictJson[$i] = $wordData;

                $i++;
                if($i == 50000){
                    file_put_contents($this->projectDir.'/db-dict/JMdict-'.$page.'.json', json_encode($JMdictJson, JSON_UNESCAPED_UNICODE));
                    $i = 0;
                    $page++;
                    $JMdictJson = [];
                }
            }

            $reader->next('entry');
        }
        file_put_contents($this->projectDir.'/db-dict/JMdict-'.$page.'.json', json_encode($JMdictJson, JSON_UNESCAPED_UNICODE));
        $reader->close();
        return 0;
    }
}
