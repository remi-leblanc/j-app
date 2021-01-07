<?php

namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

use Symfony\Component\Console\Question\Question;

use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Type;
use App\Repository\TypeRepository;


class JappSplitGroupCommand extends Command
{
    protected static $defaultName = 'japp:splitgroup';

    private $em;
    private $types;
    private $typesObj;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
        $this->typesObj = $this->em->getRepository(Type::class)->findAll();
        foreach($this->typesObj as $typeObj){
            $this->types[] = $typeObj->getName();
        }
    }

    protected function configure()
    {
        $this
            ->setDescription('Set a random SplitGroup value for every word in the selected Type.')
            ->setHelp('Set a random SplitGroup value for every word in the selected Type.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {

        $io = new SymfonyStyle($input, $output);

        $selectMode = $io->choice('Select attribution mode', ["Only empty words", "Remap all words"]);

        $selectedType = $io->choice('Select word Type', $this->types);
        $selectedType = array_search($selectedType, $this->types);
        $selectedTypeObj = $this->typesObj[$selectedType];

        $words = $selectedTypeObj->getWords();

        $wordGroups = [];
        $processed = [];
        foreach($words as $word){
            
            $group = $word->getSplitGroup();
            if($group != null){
                $wordGroups[] = $group;
            }
            $rand = rand(0, count($words)-1);
            while(in_array($rand, $processed)){
                $rand = rand(0, count($words)-1);
            }
            $processed[] = $rand;
        }
        if($selectMode == "Only empty words"){
            $splitGroups = array_count_values($wordGroups);
        }
        else{
            $splitGroups = [];
        }
        foreach($processed as $rand){
            if($selectMode == "Only empty words" && $words[$rand]->getSplitGroup() != null){
                continue;
            }
            $splitGroup = 0;
            while(isset($splitGroups[$splitGroup]) && $splitGroups[$splitGroup] >= 50){
                $splitGroup++;
            }
            if(!isset($splitGroups[$splitGroup])){
                $splitGroups[$splitGroup] = 0;
            }
            $splitGroups[$splitGroup]++;
            $selectedTypeObj->setSplitGroupCount(count($splitGroups));
            $words[$rand]->setSplitGroup($splitGroup);
            
        }
        $this->em->flush();
        return 0;
    }
}
