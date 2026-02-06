<?php

namespace App\Controller;

use App\Entity\TravelProfile;
use App\Repository\TravelProfileRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/profiles')]
class TravelProfileController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TravelProfileRepository $profileRepository
    ) {}

    #[Route('', name: 'profile_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $page = max(1, $request->query->getInt('page', 1));
        $limit = min(100, max(1, $request->query->getInt('limit', 20)));
        $offset = ($page - 1) * $limit;

        $profiles = $this->profileRepository->findBy([], ['id' => 'ASC'], $limit, $offset);
        $total = $this->profileRepository->count([]);

        $data = array_map(function (TravelProfile $profile) {
            return $this->serializeProfile($profile);
        }, $profiles);

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

    #[Route('/{id}', name: 'profile_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $profile = $this->profileRepository->find($id);

        if (!$profile) {
            return $this->json(['error' => 'Profile not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializeProfile($profile));
    }

    #[Route('', name: 'profile_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $profile = new TravelProfile();
        $profile->setName($data['name'] ?? '');
        $profile->setDescription($data['description'] ?? null);
        $profile->setPreferences($data['preferences'] ?? []);
        $profile->setAiInstructions($data['aiInstructions'] ?? null);

        $this->entityManager->persist($profile);
        $this->entityManager->flush();

        return $this->json(
            $this->serializeProfile($profile),
            Response::HTTP_CREATED
        );
    }

    #[Route('/{id}', name: 'profile_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $profile = $this->profileRepository->find($id);

        if (!$profile) {
            return $this->json(['error' => 'Profile not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['name'])) {
            $profile->setName($data['name']);
        }
        if (isset($data['description'])) {
            $profile->setDescription($data['description']);
        }
        if (isset($data['preferences'])) {
            $profile->setPreferences($data['preferences']);
        }
        if (isset($data['aiInstructions'])) {
            $profile->setAiInstructions($data['aiInstructions']);
        }

        $this->entityManager->flush();

        return $this->json($this->serializeProfile($profile));
    }

    #[Route('/{id}', name: 'profile_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $profile = $this->profileRepository->find($id);

        if (!$profile) {
            return $this->json(['error' => 'Profile not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($profile);
        $this->entityManager->flush();

        return $this->json(['message' => 'Profile deleted successfully']);
    }

    private function serializeProfile(TravelProfile $profile): array
    {
        return [
            'id' => $profile->getId(),
            'name' => $profile->getName(),
            'description' => $profile->getDescription(),
            'preferences' => $profile->getPreferences(),
            'aiInstructions' => $profile->getAiInstructions(),
            'createdAt' => $profile->getCreatedAt()->format('c'),
            'updatedAt' => $profile->getUpdatedAt()->format('c')
        ];
    }
}
