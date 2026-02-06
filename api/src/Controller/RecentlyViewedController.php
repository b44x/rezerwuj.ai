<?php

namespace App\Controller;

use App\Entity\RecentlyViewed;
use App\Repository\RecentlyViewedRepository;
use App\Repository\HotelRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/recently-viewed')]
class RecentlyViewedController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private RecentlyViewedRepository $recentlyViewedRepository,
        private HotelRepository $hotelRepository,
        private UserRepository $userRepository
    ) {}

    #[Route('', name: 'recently_viewed_list', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function list(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $limit = min(50, max(1, $request->query->getInt('limit', 10)));

        $recentlyViewed = $this->recentlyViewedRepository->findRecentByUser($user, $limit);

        $data = array_map(function (RecentlyViewed $rv) {
            $hotel = $rv->getHotel();
            return [
                'id' => $rv->getId(),
                'hotel' => [
                    'id' => $hotel->getId(),
                    'slug' => $hotel->getSlug(),
                    'name' => $hotel->getName(),
                    'address' => $hotel->getAddress(),
                    'city' => $hotel->getCity(),
                    'country' => $hotel->getCountry(),
                    'location' => $hotel->getLocation(),
                ],
                'viewedAt' => $rv->getViewedAt()->format('c'),
            ];
        }, $recentlyViewed);

        return $this->json([
            'data' => $data,
            'total' => count($data)
        ]);
    }

    #[Route('/track', name: 'recently_viewed_track', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function track(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['hotelId'])) {
            return $this->json(['error' => 'Hotel ID is required'], Response::HTTP_BAD_REQUEST);
        }

        $user = $this->getUser();
        $hotel = $this->hotelRepository->find($data['hotelId']);

        if (!$hotel) {
            return $this->json(['error' => 'Hotel not found'], Response::HTTP_NOT_FOUND);
        }

        // Check if already viewed recently (within last hour)
        if ($this->recentlyViewedRepository->hasRecentView($user, $hotel->getId())) {
            return $this->json(['message' => 'Already tracked recently']);
        }

        // Create new tracking entry
        $recentlyViewed = new RecentlyViewed();
        $recentlyViewed->setUser($user);
        $recentlyViewed->setHotel($hotel);
        $recentlyViewed->setIpAddress($request->getClientIp());
        $recentlyViewed->setUserAgent($request->headers->get('User-Agent'));

        $this->entityManager->persist($recentlyViewed);
        $this->entityManager->flush();

        return $this->json([
            'message' => 'View tracked successfully',
            'id' => $recentlyViewed->getId()
        ], Response::HTTP_CREATED);
    }

    #[Route('/popular', name: 'recently_viewed_popular', methods: ['GET'])]
    public function popular(Request $request): JsonResponse
    {
        $limit = min(20, max(1, $request->query->getInt('limit', 10)));
        $popular = $this->recentlyViewedRepository->findMostViewed($limit);

        return $this->json([
            'data' => $popular,
            'total' => count($popular)
        ]);
    }

    #[Route('/stats', name: 'recently_viewed_stats', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function stats(): JsonResponse
    {
        $user = $this->getUser();

        // Get total views count
        $totalViews = $this->recentlyViewedRepository->count(['user' => $user]);

        // Get views this week
        $oneWeekAgo = new \DateTimeImmutable('-1 week');
        $qb = $this->entityManager->createQueryBuilder();
        $viewsThisWeek = $qb->select('COUNT(rv.id)')
            ->from(RecentlyViewed::class, 'rv')
            ->where('rv.user = :user')
            ->andWhere('rv.viewedAt >= :oneWeekAgo')
            ->setParameter('user', $user)
            ->setParameter('oneWeekAgo', $oneWeekAgo)
            ->getQuery()
            ->getSingleScalarResult();

        return $this->json([
            'totalViews' => $totalViews,
            'viewsThisWeek' => $viewsThisWeek,
        ]);
    }
}
