<?php

namespace App\Command;

use App\Entity\OfferPriceHistory;
use App\Repository\OfferRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:record:offer-prices',
    description: 'Records current prices for all active offers (for price tracking)',
)]
class RecordOfferPricesCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private OfferRepository $offerRepository
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Recording Offer Prices');

        // Get all active offers
        $offers = $this->offerRepository->findBy(['isActive' => true]);

        if (count($offers) === 0) {
            $io->warning('No active offers found');
            return Command::SUCCESS;
        }

        $io->progressStart(count($offers));

        $recorded = 0;
        foreach ($offers as $offer) {
            // Create price history record
            $priceHistory = new OfferPriceHistory();
            $priceHistory->setOffer($offer);
            $priceHistory->setPrice($offer->getPrice());
            $priceHistory->setPricePerPerson($offer->isPricePerPerson());

            // Simulate price changes for demo (in production, this would come from actual scraping)
            // Randomly adjust price by -5% to +5%
            $randomAdjustment = (rand(-500, 500) / 10000); // -5% to +5%
            $currentPrice = (float) $offer->getPrice();
            $newPrice = $currentPrice * (1 + $randomAdjustment);

            $priceHistory->setPrice((string) $newPrice);

            if ($randomAdjustment < -0.02) {
                $priceHistory->setNotes('Cena spadła - promocja');
            } elseif ($randomAdjustment > 0.02) {
                $priceHistory->setNotes('Cena wzrosła - zwiększony popyt');
            }

            $this->entityManager->persist($priceHistory);
            $recorded++;

            $io->progressAdvance();
        }

        $this->entityManager->flush();
        $io->progressFinish();

        $io->success(sprintf('Recorded prices for %d offers', $recorded));

        return Command::SUCCESS;
    }
}
