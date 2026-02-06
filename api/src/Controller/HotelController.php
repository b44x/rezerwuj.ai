<?php

namespace App\Controller;

use App\Entity\Hotel;
use App\Repository\HotelRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/hotels')]
class HotelController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private HotelRepository $hotelRepository
    ) {}

    #[Route('', name: 'hotel_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $page = max(1, $request->query->getInt('page', 1));
        $limit = min(100, max(1, $request->query->getInt('limit', 20)));
        $offset = ($page - 1) * $limit;

        $hotels = $this->hotelRepository->findBy([], ['id' => 'ASC'], $limit, $offset);
        $total = $this->hotelRepository->count([]);

        $data = array_map(function (Hotel $hotel) {
            return $this->serializeHotel($hotel);
        }, $hotels);

        return $this->json([
            'data' => $data,
            'meta' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ]);
    }

    #[Route('/{slug}', name: 'hotel_show', methods: ['GET'], requirements: ['slug' => '[a-z0-9\-]+'])]
    public function show(string $slug): JsonResponse
    {
        $hotel = $this->hotelRepository->findBySlug($slug);

        if (!$hotel) {
            return $this->json(['error' => 'Hotel not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializeHotel($hotel));
    }

    #[Route('', name: 'hotel_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $hotel = new Hotel();
        $hotel->setName($data['name'] ?? '');
        $hotel->setAddress($data['address'] ?? '');
        $hotel->setCity($data['city'] ?? '');
        $hotel->setCountry($data['country'] ?? '');
        $hotel->setLocation($data['location'] ?? ['lat' => 0, 'lng' => 0]);

        $this->entityManager->persist($hotel);
        $this->entityManager->flush();

        return $this->json(
            $this->serializeHotel($hotel),
            Response::HTTP_CREATED
        );
    }

    #[Route('/{id}', name: 'hotel_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $hotel = $this->hotelRepository->find($id);

        if (!$hotel) {
            return $this->json(['error' => 'Hotel not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['name'])) {
            $hotel->setName($data['name']);
        }
        if (isset($data['address'])) {
            $hotel->setAddress($data['address']);
        }
        if (isset($data['city'])) {
            $hotel->setCity($data['city']);
        }
        if (isset($data['country'])) {
            $hotel->setCountry($data['country']);
        }
        if (isset($data['location'])) {
            $hotel->setLocation($data['location']);
        }

        $this->entityManager->flush();

        return $this->json($this->serializeHotel($hotel));
    }

    #[Route('/{id}', name: 'hotel_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $hotel = $this->hotelRepository->find($id);

        if (!$hotel) {
            return $this->json(['error' => 'Hotel not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($hotel);
        $this->entityManager->flush();

        return $this->json(['message' => 'Hotel deleted successfully']);
    }

    private function serializeHotel(Hotel $hotel): array
    {
        return [
            'id' => $hotel->getId(),
            'slug' => $hotel->getSlug(),
            'name' => $hotel->getName(),
            'address' => $hotel->getAddress(),
            'city' => $hotel->getCity(),
            'country' => $hotel->getCountry(),
            'location' => $hotel->getLocation(),
            'imageUrl' => $hotel->getImageUrl(),
            'createdAt' => $hotel->getCreatedAt()->format('c'),
            'updatedAt' => $hotel->getUpdatedAt()->format('c')
        ];
    }
}
