<?php

namespace App\Controller;

use App\Repository\OfferRepository;
use App\Repository\OfferPriceHistoryRepository;
use App\Repository\TravelGroupRepository;
use App\Service\Scoring\ScoringServiceInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/offers')]
class OfferController extends AbstractController
{
    public function __construct(
        private OfferRepository $offerRepository,
        private OfferPriceHistoryRepository $priceHistoryRepository,
        private TravelGroupRepository $travelGroupRepository,
        private ScoringServiceInterface $scoringService
    ) {
    }

    #[Route('', name: 'api_offers_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        // Get filter parameters from query string
        $departureCity = $request->query->get('departureCity');
        $departureDateFrom = $request->query->get('departureDateFrom');
        $departureDateTo = $request->query->get('departureDateTo');
        $durationDays = $request->query->get('durationDays');
        $priceMin = $request->query->get('priceMin');
        $priceMax = $request->query->get('priceMax');
        $boardType = $request->query->get('boardType');
        $providerId = $request->query->get('providerId');

        // Pagination
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = min(100, max(1, (int) $request->query->get('limit', 20)));
        $offset = ($page - 1) * $limit;

        // Parse dates if provided
        $parsedDateFrom = $departureDateFrom ? new \DateTimeImmutable($departureDateFrom) : null;
        $parsedDateTo = $departureDateTo ? new \DateTimeImmutable($departureDateTo) : null;

        // Get offers with filters
        $offers = $this->offerRepository->findWithFilters(
            $departureCity,
            $parsedDateFrom,
            $parsedDateTo,
            $durationDays ? (int) $durationDays : null,
            $priceMin ? (float) $priceMin : null,
            $priceMax ? (float) $priceMax : null,
            $boardType,
            $providerId,
            $limit,
            $offset
        );

        // Get total count for pagination
        $totalCount = $this->offerRepository->countWithFilters(
            $departureCity,
            $parsedDateFrom,
            $parsedDateTo,
            $durationDays ? (int) $durationDays : null,
            $priceMin ? (float) $priceMin : null,
            $priceMax ? (float) $priceMax : null,
            $boardType,
            $providerId
        );

        // Serialize offers
        $data = array_map(fn($offer) => $this->serializeOffer($offer), $offers);

        return $this->json([
            'data' => $data,
            'meta' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $totalCount,
                'pages' => (int) ceil($totalCount / $limit),
            ],
        ]);
    }

    #[Route('/filters', name: 'api_offers_filters', methods: ['GET'])]
    public function filters(): JsonResponse
    {
        return $this->json([
            'data' => [
                'departureCities' => $this->offerRepository->getUniqueDepartureCities(),
                'boardTypes' => $this->offerRepository->getUniqueBoardTypes(),
            ],
        ]);
    }

    #[Route('/ai-recommended/{groupId}', name: 'api_offers_ai_recommended', methods: ['GET'])]
    public function aiRecommended(int $groupId, Request $request): JsonResponse
    {
        // Find the travel group
        $group = $this->travelGroupRepository->find($groupId);

        if (!$group) {
            return $this->json(['error' => 'Travel group not found'], 404);
        }

        // Get filter parameters (optional - can combine with scoring)
        $departureCity = $request->query->get('departureCity');
        $boardType = $request->query->get('boardType');
        $priceMax = $request->query->get('priceMax');

        // Fetch offers with basic filters
        $offers = $this->offerRepository->findWithFilters(
            $departureCity,
            null, // dates
            null,
            null, // duration
            null, // priceMin
            $priceMax ? (float) $priceMax : null,
            $boardType,
            null, // providerId
            50, // limit - get more for better scoring
            0
        );

        if (empty($offers)) {
            return $this->json([
                'data' => [],
                'meta' => [
                    'scoringService' => $this->scoringService->getName(),
                    'groupId' => $groupId,
                    'groupName' => $group->getName(),
                ],
            ]);
        }

        // Score all offers
        $scoredOffers = $this->scoringService->scoreMany($offers, $group);

        // Serialize with scores
        $data = array_map(function ($scored) {
            $offer = $scored['offer'];
            $serialized = $this->serializeOffer($offer);
            $serialized['aiScore'] = [
                'score' => $scored['score'],
                'reasoning' => $scored['reasoning'],
                'breakdown' => $scored['breakdown'],
            ];
            return $serialized;
        }, $scoredOffers);

        // Limit to top 20
        $data = array_slice($data, 0, 20);

        return $this->json([
            'data' => $data,
            'meta' => [
                'scoringService' => $this->scoringService->getName(),
                'groupId' => $groupId,
                'groupName' => $group->getName(),
                'totalScored' => count($scoredOffers),
                'returned' => count($data),
            ],
        ]);
    }

    #[Route('/{id}', name: 'api_offers_show', methods: ['GET'])]
    public function show(string $id): JsonResponse
    {
        $offer = $this->offerRepository->find($id);

        if (!$offer) {
            return $this->json(['error' => 'Offer not found'], 404);
        }

        return $this->json([
            'data' => $this->serializeOffer($offer, true),
        ]);
    }

    private function serializeOffer($offer, bool $includePriceHistory = false): array
    {
        $hotel = $offer->getHotel();
        $provider = $offer->getProvider();

        $data = [
            'id' => $offer->getId()->toRfc4122(),
            'price' => (float) $offer->getPrice(),
            'pricePerPerson' => $offer->isPricePerPerson(),
            'departureCity' => $offer->getDepartureCity(),
            'departureDate' => $offer->getDepartureDate()->format('Y-m-d'),
            'returnDate' => $offer->getReturnDate()->format('Y-m-d'),
            'durationDays' => $offer->getDurationDays(),
            'boardType' => $offer->getBoardType(),
            'roomType' => $offer->getRoomType(),
            'flightInfo' => $offer->getFlightInfo(),
            'externalUrl' => $offer->getExternalUrl(),
            'isActive' => $offer->isActive(),
            'lastCheckedAt' => $offer->getLastCheckedAt()?->format('Y-m-d H:i:s'),
            'hotel' => [
                'id' => $hotel->getId(),
                'slug' => $hotel->getSlug(),
                'name' => $hotel->getName(),
                'address' => $hotel->getAddress(),
                'city' => $hotel->getCity(),
                'country' => $hotel->getCountry(),
                'location' => $hotel->getLocation(),
                'imageUrl' => $hotel->getImageUrl(),
            ],
            'provider' => [
                'id' => $provider->getId()->toRfc4122(),
                'name' => $provider->getName(),
                'logoUrl' => $provider->getLogoUrl(),
                'website' => $provider->getWebsite(),
            ],
            'createdAt' => $offer->getCreatedAt()->format('Y-m-d H:i:s'),
            'updatedAt' => $offer->getUpdatedAt()->format('Y-m-d H:i:s'),
        ];

        // Add price history and change statistics if requested
        if ($includePriceHistory) {
            // Get price change statistics
            $priceChangeStats = $this->priceHistoryRepository->getPriceChangeStats($offer);
            $data['priceChange'] = $priceChangeStats;

            // Get price history
            $priceHistory = $this->priceHistoryRepository->findByOffer($offer, 10);
            $data['priceHistory'] = array_map(function ($record) {
                return [
                    'price' => (float) $record->getPrice(),
                    'checkedAt' => $record->getCheckedAt()->format('Y-m-d H:i:s'),
                    'notes' => $record->getNotes(),
                ];
            }, $priceHistory);
        }

        return $data;
    }
}
