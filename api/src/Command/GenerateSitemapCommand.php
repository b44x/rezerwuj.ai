<?php

namespace App\Command;

use App\Repository\HotelRepository;
use App\Repository\OfferRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:generate:sitemap',
    description: 'Generate sitemap.xml for SEO',
)]
class GenerateSitemapCommand extends Command
{
    public function __construct(
        private HotelRepository $hotelRepository,
        private OfferRepository $offerRepository,
        private string $projectDir
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Generating sitemap.xml');

        $baseUrl = 'https://rezerwuj.ai';
        $now = (new \DateTime())->format('Y-m-d');

        // Start XML
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

        // Static pages
        $staticPages = [
            ['loc' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
            ['loc' => '/hotels', 'priority' => '1.0', 'changefreq' => 'daily'],
            ['loc' => '/dashboard', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['loc' => '/map', 'priority' => '0.7', 'changefreq' => 'weekly'],
        ];

        foreach ($staticPages as $page) {
            $xml .= $this->generateUrlEntry(
                $baseUrl . $page['loc'],
                $now,
                $page['changefreq'],
                $page['priority']
            );
        }

        // Dynamic pages: Hotels
        $hotels = $this->hotelRepository->findAll();
        $io->info(sprintf('Found %d hotels', count($hotels)));

        foreach ($hotels as $hotel) {
            $xml .= $this->generateUrlEntry(
                $baseUrl . '/hotels/' . $hotel->getSlug(),
                $hotel->getUpdatedAt()->format('Y-m-d'),
                'weekly',
                '0.9'
            );
        }

        // Dynamic pages: Offers (last 100 active offers)
        $offers = $this->offerRepository->findBy(['isActive' => true], ['id' => 'DESC'], 100);
        $io->info(sprintf('Found %d active offers', count($offers)));

        foreach ($offers as $offer) {
            $xml .= $this->generateUrlEntry(
                $baseUrl . '/offers/' . $offer->getId(),
                $offer->getLastCheckedAt()?->format('Y-m-d') ?? $now,
                'daily',
                '0.8'
            );
        }

        // Close XML
        $xml .= '</urlset>';

        // Write to file
        $sitemapPath = $this->projectDir . '/../client/public/sitemap.xml';
        file_put_contents($sitemapPath, $xml);

        $io->success(sprintf('Sitemap generated successfully at: %s', $sitemapPath));
        $io->info(sprintf('Total URLs: %d', count($hotels) + count($offers) + count($staticPages)));

        return Command::SUCCESS;
    }

    private function generateUrlEntry(
        string $loc,
        string $lastmod,
        string $changefreq,
        string $priority
    ): string {
        return sprintf(
            "  <url>\n    <loc>%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>%s</changefreq>\n    <priority>%s</priority>\n  </url>\n",
            htmlspecialchars($loc, ENT_XML1, 'UTF-8'),
            $lastmod,
            $changefreq,
            $priority
        );
    }
}
