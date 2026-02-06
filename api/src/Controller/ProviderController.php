<?php

namespace App\Controller;

use App\Repository\ProviderRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/providers')]
class ProviderController extends AbstractController
{
    public function __construct(
        private ProviderRepository $providerRepository
    ) {
    }

    #[Route('', name: 'api_providers_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $providers = $this->providerRepository->findActive();

        $data = array_map(fn($provider) => $this->serializeProvider($provider), $providers);

        return $this->json([
            'data' => $data,
        ]);
    }

    #[Route('/{id}', name: 'api_providers_show', methods: ['GET'])]
    public function show(string $id): JsonResponse
    {
        $provider = $this->providerRepository->find($id);

        if (!$provider) {
            return $this->json(['error' => 'Provider not found'], 404);
        }

        return $this->json([
            'data' => $this->serializeProvider($provider),
        ]);
    }

    private function serializeProvider($provider): array
    {
        return [
            'id' => $provider->getId()->toRfc4122(),
            'name' => $provider->getName(),
            'logoUrl' => $provider->getLogoUrl(),
            'website' => $provider->getWebsite(),
            'commissionPercent' => $provider->getCommissionPercent(),
            'isActive' => $provider->isActive(),
            'createdAt' => $provider->getCreatedAt()->format('Y-m-d H:i:s'),
            'updatedAt' => $provider->getUpdatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}
