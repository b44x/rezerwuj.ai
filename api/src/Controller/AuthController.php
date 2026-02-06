<?php

namespace App\Controller;

use App\Entity\PasswordResetToken;
use App\Entity\User;
use App\Repository\PasswordResetTokenRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/auth')]
class AuthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private PasswordResetTokenRepository $tokenRepository,
        private UserPasswordHasherInterface $passwordHasher,
        private JWTTokenManagerInterface $jwtManager
    ) {}

    #[Route('/register', name: 'auth_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['email'], $data['password'], $data['name'])) {
            return $this->json(['error' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }

        // Check if user already exists
        if ($this->userRepository->findOneBy(['email' => $data['email']])) {
            return $this->json(['error' => 'User already exists'], Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setName($data['name']);
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $token = $this->jwtManager->create($user);

        return $this->json([
            'user' => $this->serializeUser($user),
            'token' => $token
        ], Response::HTTP_CREATED);
    }

    #[Route('/login', name: 'auth_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['email'], $data['password'])) {
            return $this->json(['error' => 'Missing credentials'], Response::HTTP_BAD_REQUEST);
        }

        $user = $this->userRepository->findOneBy(['email' => $data['email']]);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $data['password'])) {
            return $this->json(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        $token = $this->jwtManager->create($user);

        return $this->json([
            'user' => $this->serializeUser($user),
            'token' => $token
        ]);
    }

    #[Route('/me', name: 'auth_me', methods: ['GET'])]
    public function me(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json(['user' => $this->serializeUser($user)]);
    }

    #[Route('/password/reset-request', name: 'auth_password_reset_request', methods: ['POST'])]
    public function passwordResetRequest(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['email'])) {
            return $this->json(['error' => 'Email is required'], Response::HTTP_BAD_REQUEST);
        }

        $user = $this->userRepository->findOneBy(['email' => $data['email']]);

        // Always return success to prevent email enumeration
        if (!$user) {
            return $this->json(['message' => 'If the email exists, a reset link has been sent']);
        }

        // Generate reset token
        $token = bin2hex(random_bytes(32));
        $resetToken = new PasswordResetToken();
        $resetToken->setUser($user);
        $resetToken->setToken($token);
        $resetToken->setCreatedAt(new \DateTimeImmutable());
        $resetToken->setExpiresAt(new \DateTimeImmutable('+1 hour'));

        $this->entityManager->persist($resetToken);
        $this->entityManager->flush();

        // TODO: Send email with reset link containing $token
        // For now, we'll just return the token (remove this in production!)
        return $this->json([
            'message' => 'If the email exists, a reset link has been sent',
            'token' => $token // REMOVE IN PRODUCTION - only for development
        ]);
    }

    #[Route('/password/reset', name: 'auth_password_reset', methods: ['POST'])]
    public function passwordReset(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['token'], $data['password'])) {
            return $this->json(['error' => 'Token and password are required'], Response::HTTP_BAD_REQUEST);
        }

        $resetToken = $this->tokenRepository->findValidToken($data['token']);

        if (!$resetToken) {
            return $this->json(['error' => 'Invalid or expired token'], Response::HTTP_BAD_REQUEST);
        }

        $user = $resetToken->getUser();
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));

        $resetToken->setUsed(true);

        $this->entityManager->flush();

        return $this->json(['message' => 'Password reset successfully']);
    }

    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'name' => $user->getName(),
            'roles' => $user->getRoles()
        ];
    }
}
