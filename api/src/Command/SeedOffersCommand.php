<?php

namespace App\Command;

use App\Entity\Hotel;
use App\Entity\Offer;
use App\Entity\Provider;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed:offers',
    description: 'Seeds the database with providers and offers',
)]
class SeedOffersCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // Check if providers already exist
        $existingProviders = $this->entityManager->getRepository(Provider::class)->findAll();
        if (count($existingProviders) > 0) {
            $io->warning('Providers already exist. Skipping provider creation.');
            $providers = $existingProviders;
        } else {
            // Create providers
            $io->section('Creating providers...');
            $providers = $this->createProviders($io);
        }

        // Check if offers already exist
        $existingOffers = $this->entityManager->getRepository(Offer::class)->findAll();
        if (count($existingOffers) > 0) {
            $io->warning('Offers already exist. Skipping offer creation.');
        } else {
            // Create offers
            $io->section('Creating offers...');
            $this->createOffers($io, $providers);
        }

        $io->success('Seeding completed!');

        return Command::SUCCESS;
    }

    private function createProviders(SymfonyStyle $io): array
    {
        $providers = [];

        $providerData = [
            [
                'name' => 'TUI',
                'logoUrl' => 'https://www.tui.pl/logo.png',
                'website' => 'https://www.tui.pl',
                'commission' => 5.5,
            ],
            [
                'name' => 'Itaka',
                'logoUrl' => 'https://www.itaka.pl/logo.png',
                'website' => 'https://www.itaka.pl',
                'commission' => 6.0,
            ],
            [
                'name' => 'Rainbow Tours',
                'logoUrl' => 'https://www.rainbowtours.pl/logo.png',
                'website' => 'https://www.rainbowtours.pl',
                'commission' => 5.0,
            ],
            [
                'name' => 'Wakacje.pl',
                'logoUrl' => 'https://www.wakacje.pl/logo.png',
                'website' => 'https://www.wakacje.pl',
                'commission' => 7.0,
            ],
        ];

        foreach ($providerData as $data) {
            $provider = new Provider();
            $provider->setName($data['name']);
            $provider->setLogoUrl($data['logoUrl']);
            $provider->setWebsite($data['website']);
            $provider->setCommissionPercent($data['commission']);
            $provider->setIsActive(true);

            $this->entityManager->persist($provider);
            $providers[] = $provider;

            $io->writeln(sprintf('Created provider: %s', $data['name']));
        }

        $this->entityManager->flush();

        return $providers;
    }

    private function createOffers(SymfonyStyle $io, array $providers): void
    {
        $hotels = $this->entityManager->getRepository(Hotel::class)->findAll();

        if (count($hotels) === 0) {
            $io->error('No hotels found! Please seed hotels first.');
            return;
        }

        $departureCities = ['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań'];
        $boardTypes = ['All Inclusive', 'Half Board', 'Bed & Breakfast', 'Full Board'];
        $roomTypes = ['Standard 2+2', 'Family 2+3', 'Suite 2+2', 'Apartament 2+4'];

        $offerCount = 0;

        foreach ($hotels as $hotel) {
            // Create 2-3 offers per hotel from different providers
            $providersForHotel = array_slice($providers, 0, rand(2, min(3, count($providers))));

            foreach ($providersForHotel as $provider) {
                $offer = new Offer();
                $offer->setHotel($hotel);
                $offer->setProvider($provider);

                // Random pricing
                $basePrice = rand(2500, 5500);
                $offer->setPrice((string)$basePrice);
                $offer->setPricePerPerson(true);

                // Random dates in the next 6 months
                $daysFromNow = rand(30, 180);
                $departureDate = new \DateTimeImmutable("+{$daysFromNow} days");
                $duration = rand(7, 14);
                $returnDate = $departureDate->modify("+{$duration} days");

                $offer->setDepartureCity($departureCities[array_rand($departureCities)]);
                $offer->setDepartureDate($departureDate);
                $offer->setReturnDate($returnDate);
                $offer->setDurationDays($duration);

                $offer->setBoardType($boardTypes[array_rand($boardTypes)]);
                $offer->setRoomType($roomTypes[array_rand($roomTypes)]);

                // Flight info
                $flightInfo = [
                    'airline' => ['LOT', 'Ryanair', 'Wizz Air', 'Enter Air'][array_rand(['LOT', 'Ryanair', 'Wizz Air', 'Enter Air'])],
                    'outbound' => [
                        'departure' => '06:00',
                        'arrival' => '09:30',
                    ],
                    'return' => [
                        'departure' => '18:00',
                        'arrival' => '21:30',
                    ],
                    'transferIncluded' => rand(0, 1) === 1,
                    'transferDuration' => rand(30, 90) . ' min',
                ];
                $offer->setFlightInfo($flightInfo);

                // External URL (affiliate link)
                $offer->setExternalUrl(sprintf(
                    '%s/oferta/%s?ref=rezerwuj',
                    $provider->getWebsite(),
                    strtolower(str_replace(' ', '-', $hotel->getName()))
                ));

                $offer->setIsActive(true);
                $offer->setLastCheckedAt(new \DateTimeImmutable());

                $this->entityManager->persist($offer);
                $offerCount++;

                $io->writeln(sprintf(
                    'Created offer: %s - %s (%s, %d dni) - %s zł',
                    $hotel->getName(),
                    $provider->getName(),
                    $offer->getDepartureCity(),
                    $offer->getDurationDays(),
                    $offer->getPrice()
                ));
            }
        }

        $this->entityManager->flush();

        $io->success(sprintf('Created %d offers for %d hotels', $offerCount, count($hotels)));
    }
}
