<?php

namespace App\Controller;

use App\Entity\SavedComparison;
use App\Repository\SavedComparisonRepository;
use App\Repository\OfferRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Uid\Uuid;

#[Route('/api/saved-comparisons')]
class SavedComparisonController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SavedComparisonRepository $savedComparisonRepository,
        private OfferRepository $offerRepository
    ) {
    }

    /**
     * Save a new comparison
     */
    #[Route('', name: 'api_saved_comparisons_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name']) || !isset($data['offerIds']) || !is_array($data['offerIds'])) {
            return $this->json(['error' => 'Invalid request data'], 400);
        }

        if (count($data['offerIds']) === 0 || count($data['offerIds']) > 4) {
            return $this->json(['error' => 'Must have 1-4 offers'], 400);
        }

        // Get authenticated user from JWT token
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Authentication required'], 401);
        }

        $savedComparison = new SavedComparison();
        $savedComparison->setUser($user);
        $savedComparison->setName($data['name']);
        $savedComparison->setOfferIds($data['offerIds']);

        $this->entityManager->persist($savedComparison);
        $this->entityManager->flush();

        return $this->json([
            'id' => $savedComparison->getId(),
            'name' => $savedComparison->getName(),
            'offerIds' => $savedComparison->getOfferIds(),
            'shareToken' => $savedComparison->getShareToken(),
            'createdAt' => $savedComparison->getCreatedAt()->format('c'),
            'updatedAt' => $savedComparison->getUpdatedAt()->format('c'),
        ], 201);
    }

    /**
     * List all saved comparisons for current user
     */
    #[Route('', name: 'api_saved_comparisons_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        // Get authenticated user from JWT token
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Authentication required'], 401);
        }

        $comparisons = $this->savedComparisonRepository->findBy(
            ['user' => $user],
            ['createdAt' => 'DESC']
        );

        $data = array_map(function (SavedComparison $comparison) {
            return [
                'id' => $comparison->getId(),
                'name' => $comparison->getName(),
                'offerIds' => $comparison->getOfferIds(),
                'offerCount' => count($comparison->getOfferIds()),
                'shareToken' => $comparison->getShareToken(),
                'createdAt' => $comparison->getCreatedAt()->format('c'),
                'updatedAt' => $comparison->getUpdatedAt()->format('c'),
            ];
        }, $comparisons);

        return $this->json(['data' => $data]);
    }

    /**
     * Get a specific saved comparison by ID
     */
    #[Route('/{id}', name: 'api_saved_comparisons_show', methods: ['GET'])]
    public function show(string $id): JsonResponse
    {
        try {
            $uuid = Uuid::fromString($id);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Invalid ID format'], 400);
        }

        $comparison = $this->savedComparisonRepository->find($uuid);

        if (!$comparison) {
            return $this->json(['error' => 'Comparison not found'], 404);
        }

        // Fetch the actual offers
        $offers = $this->offerRepository->findBy(['id' => $comparison->getOfferIds()]);

        return $this->json([
            'id' => $comparison->getId(),
            'name' => $comparison->getName(),
            'offerIds' => $comparison->getOfferIds(),
            'offers' => array_map(fn($offer) => $this->serializeOffer($offer), $offers),
            'shareToken' => $comparison->getShareToken(),
            'createdAt' => $comparison->getCreatedAt()->format('c'),
            'updatedAt' => $comparison->getUpdatedAt()->format('c'),
        ]);
    }

    /**
     * Get a shared comparison by token (public, no auth required)
     */
    #[Route('/shared/{shareToken}', name: 'api_saved_comparisons_shared', methods: ['GET'])]
    public function getShared(string $shareToken): JsonResponse
    {
        $comparison = $this->savedComparisonRepository->findOneBy(['shareToken' => $shareToken]);

        if (!$comparison) {
            return $this->json(['error' => 'Shared comparison not found'], 404);
        }

        // Fetch the actual offers
        $offers = $this->offerRepository->findBy(['id' => $comparison->getOfferIds()]);

        return $this->json([
            'id' => $comparison->getId(),
            'name' => $comparison->getName(),
            'offers' => array_map(fn($offer) => $this->serializeOffer($offer), $offers),
            'createdAt' => $comparison->getCreatedAt()->format('c'),
        ]);
    }

    /**
     * Delete a saved comparison
     */
    #[Route('/{id}', name: 'api_saved_comparisons_delete', methods: ['DELETE'])]
    public function delete(string $id): JsonResponse
    {
        try {
            $uuid = Uuid::fromString($id);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Invalid ID format'], 400);
        }

        $comparison = $this->savedComparisonRepository->find($uuid);

        if (!$comparison) {
            return $this->json(['error' => 'Comparison not found'], 404);
        }

        // TODO: Check if user owns this comparison when auth is ready

        $this->entityManager->remove($comparison);
        $this->entityManager->flush();

        return $this->json(['message' => 'Comparison deleted successfully']);
    }

    /**
     * Serialize offer for JSON response
     */
    private function serializeOffer($offer): array
    {
        return [
            'id' => $offer->getId(),
            'price' => $offer->getPrice(),
            'pricePerPerson' => $offer->isPricePerPerson(),
            'departureCity' => $offer->getDepartureCity(),
            'departureDate' => $offer->getDepartureDate()->format('Y-m-d'),
            'returnDate' => $offer->getReturnDate()->format('Y-m-d'),
            'durationDays' => $offer->getDurationDays(),
            'boardType' => $offer->getBoardType(),
            'roomType' => $offer->getRoomType(),
            'flightInfo' => $offer->getFlightInfo(),
            'externalUrl' => $offer->getExternalUrl(),
            'hotel' => [
                'id' => $offer->getHotel()->getId(),
                'slug' => $offer->getHotel()->getSlug(),
                'name' => $offer->getHotel()->getName(),
                'address' => $offer->getHotel()->getAddress(),
                'city' => $offer->getHotel()->getCity(),
                'country' => $offer->getHotel()->getCountry(),
                'location' => $offer->getHotel()->getLocation(),
            ],
            'provider' => [
                'id' => $offer->getProvider()->getId(),
                'name' => $offer->getProvider()->getName(),
                'logoUrl' => $offer->getProvider()->getLogoUrl(),
                'website' => $offer->getProvider()->getWebsite(),
            ],
        ];
    }
}
