<?php

namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

use Symfony\Component\HttpKernel\KernelInterface;

class JappJishoApiProcessCommand extends Command
{
    protected static $defaultName = 'japp:jishoapi:process';

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
        $row = 0;
        $curly = [];
        $mh = curl_multi_init();
        if (($handle = fopen("bigfile.csv", "r")) !== FALSE) {
            while (($bigfileRow = fgetcsv($handle, 1000, ";")) !== FALSE) {
                if($row){
                    $curly[$row] = curl_init();
                    curl_setopt($curly[$row], CURLOPT_SSL_VERIFYPEER, false);
                    curl_setopt($curly[$row], CURLOPT_RETURNTRANSFER, 1);
                    curl_setopt($curly[$row], CURLOPT_HEADER, 1);
                    curl_setopt($curly[$row], CURLOPT_URL, $bigfileRow[9]);
                    curl_setopt($curly[$row], CURLOPT_HTTPGET, 1);
                    curl_setopt($curly[$row], CURLOPT_DNS_USE_GLOBAL_CACHE, false );
                    curl_setopt($curly[$row], CURLOPT_DNS_CACHE_TIMEOUT, 2 );
                    curl_setopt($curly[$row], CURLOPT_VERBOSE,true);
                    curl_setopt($curly[$row], CURLOPT_FOLLOWLOCATION, true);
                    curl_multi_add_handle($mh, $curly[$row]);
                }
                $row++;
            }
            fclose($handle);
        }
        $running = null;
        do{
            curl_multi_exec($mh, $running);
        } while($running > 0);
        foreach($curly as $id => $c) {
            //$result[$id] = json_decode(curl_multi_getcontent($c), true);
            echo 'y';
            echo curl_multi_getcontent($c);
            die();
            curl_multi_remove_handle($mh, $c);
        }
        curl_multi_close($mh);
        return 0;
    }
}