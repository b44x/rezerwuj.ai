<?php

namespace App\Controller;

use App\Entity\TravelGroup;
use App\Repository\TravelGroupRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/travel-groups')]
class TravelGroupController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TravelGroupRepository $groupRepository
    ) {}

    #[Route('', name: 'travel_group_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $page = max(1, $request->query->getInt('page', 1));
        $limit = min(100, max(1, $request->query->getInt('limit', 20)));
        $offset = ($page - 1) * $limit;

        $groups = $this->groupRepository->findBy([], ['id' => 'ASC'], $limit, $offset);
        $total = $this->groupRepository->count([]);

        $data = array_map(function (TravelGroup $group) {
            return $this->serializeGroup($group);
        }, $groups);

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

    #[Route('/{id}', name: 'travel_group_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $group = $this->groupRepository->find($id);

        if (!$group) {
            return $this->json(['error' => 'Travel group not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializeGroup($group));
    }

    #[Route('', name: 'travel_group_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $group = new TravelGroup();
        $group->setName($data['name'] ?? '');
        $group->setDescription($data['description'] ?? null);
        $group->setPeople($data['people'] ?? []);
        $group->setAiInstructions($data['aiInstructions'] ?? null);

        // Validate people structure
        foreach ($group->getPeople() as $person) {
            if (!isset($person['name']) || !isset($person['birthDate']) || !isset($person['gender'])) {
                return $this->json([
                    'error' => 'Each person must have name, birthDate, and gender'
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        $this->entityManager->persist($group);
        $this->entityManager->flush();

        return $this->json(
            $this->serializeGroup($group),
            Response::HTTP_CREATED
        );
    }

    #[Route('/{id}', name: 'travel_group_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $group = $this->groupRepository->find($id);

        if (!$group) {
            return $this->json(['error' => 'Travel group not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['name'])) {
            $group->setName($data['name']);
        }
        if (isset($data['description'])) {
            $group->setDescription($data['description']);
        }
        if (isset($data['people'])) {
            $group->setPeople($data['people']);
        }
        if (isset($data['aiInstructions'])) {
            $group->setAiInstructions($data['aiInstructions']);
        }

        $this->entityManager->flush();

        return $this->json($this->serializeGroup($group));
    }

    #[Route('/{id}', name: 'travel_group_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $group = $this->groupRepository->find($id);

        if (!$group) {
            return $this->json(['error' => 'Travel group not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($group);
        $this->entityManager->flush();

        return $this->json(['message' => 'Travel group deleted successfully']);
    }

    #[Route('/{id}/people', name: 'travel_group_add_person', methods: ['POST'])]
    public function addPerson(int $id, Request $request): JsonResponse
    {
        $group = $this->groupRepository->find($id);

        if (!$group) {
            return $this->json(['error' => 'Travel group not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['name']) || !isset($data['age']) || !isset($data['gender'])) {
            return $this->json([
                'error' => 'Person must have name, age, and gender'
            ], Response::HTTP_BAD_REQUEST);
        }

        $group->addPerson($data);
        $this->entityManager->flush();

        return $this->json($this->serializeGroup($group));
    }

    #[Route('/{id}/people/{personIndex}', name: 'travel_group_remove_person', methods: ['DELETE'])]
    public function removePerson(int $id, int $personIndex): JsonResponse
    {
        $group = $this->groupRepository->find($id);

        if (!$group) {
            return $this->json(['error' => 'Travel group not found'], Response::HTTP_NOT_FOUND);
        }

        $group->removePerson($personIndex);
        $this->entityManager->flush();

        return $this->json($this->serializeGroup($group));
    }

    private function serializeGroup(TravelGroup $group): array
    {
        return [
            'id' => $group->getId(),
            'name' => $group->getName(),
            'description' => $group->getDescription(),
            'people' => $group->getPeople(),
            'peopleCount' => count($group->getPeople()),
            'aiInstructions' => $group->getAiInstructions(),
            'createdAt' => $group->getCreatedAt()->format('c'),
            'updatedAt' => $group->getUpdatedAt()->format('c')
        ];
    }
}
